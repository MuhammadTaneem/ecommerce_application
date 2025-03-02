from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem, Voucher
from .serializers import (
    CartSerializer,
    OrderSerializer, OrderItemSerializer, CartItemSerializer, VoucherSerializer,

)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        return Cart.objects.none()

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def create(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Override the default retrieve method to ensure a cart is always returned.
        """
        cart = self.get_cart()
        if not cart:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        Add an item to the cart or update its quantity if it already exists.
        """
        cart = self.get_cart()

        # Pass the cart instance to the serializer context
        serializer = CartItemSerializer(data=request.data, context={'cart': cart})
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'Item added to cart'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        cart = self.get_cart()
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            id=request.data.get('cart_item_id')
        )

        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_cart()
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            id=request.data.get('cart_item_id')
        )
        cart_item.delete()
        return Response({'status': 'Item removed from cart'})

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self.get_cart()
        cart.items.all().delete()
        return Response({'status': 'Cart cleared'})


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if not cart.items.exists():
            return Response(
                {'error': 'Cannot create order from empty cart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            # Create order
            order = serializer.save(
                user=request.user,
                subtotal=cart.total_amount
            )

            # Create order items from cart items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    sku=cart_item.sku,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.unit_price,
                    subtotal=cart_item.subtotal
                )

            # Clear the cart
            cart.items.all().delete()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'PENDING':
            order.status = 'CANCELLED'
            order.save()
            return Response({'status': 'Order cancelled'})
        return Response(
            {'error': 'Cannot cancel order in current status'},
            status=status.HTTP_400_BAD_REQUEST
        )


class VoucherViewSet(viewsets.ModelViewSet):
    serializer_class = VoucherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vouchers = Voucher.objects.all()
        return vouchers

