from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer,
    CartItemCreateSerializer
)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        return Cart.objects.filter(session_id=self.request.session.session_key)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save(session_id=self.request.session.session_key)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        serializer = CartItemCreateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                cart_item = CartItem.objects.get(
                    cart=cart,
                    product_id=serializer.validated_data['product_id'],
                    sku_id=serializer.validated_data.get('sku_id')
                )
                cart_item.quantity += serializer.validated_data['quantity']
                cart_item.save()
            except CartItem.DoesNotExist:
                CartItem.objects.create(cart=cart, **serializer.validated_data)

            return Response({'status': 'Item added to cart'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_item(self, request, pk=None):
        cart = self.get_object()
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

    @action(detail=True, methods=['post'])
    def remove_item(self, request, pk=None):
        cart = self.get_object()
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            id=request.data.get('cart_item_id')
        )
        cart_item.delete()
        return Response({'status': 'Item removed from cart'})

    @action(detail=True, methods=['post'])
    def clear(self, request, pk=None):
        cart = self.get_object()
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

