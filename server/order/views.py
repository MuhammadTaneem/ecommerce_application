from django.db import transaction
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
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        if not cart:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post','get','delete'])
    def item(self, request):
        cart = self.get_cart()

        if request.method == 'POST':
            serializer = CartItemSerializer(data=request.data, context={'cart': cart})
            if serializer.is_valid():
                serializer.save()
                return Response({'detail': 'Item added to cart'}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'GET':
            cart_items = cart.items.all()
            serializer = CartItemSerializer(cart_items, many=True)
            return Response(serializer.data)
        elif request.method == 'DELETE':
            cart.items.all().delete()
            return Response({'detail': 'All items removed from cart'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['put','delete'], url_path='item/(?P<item_id>[^/.]+)')
    def item_detail(self, request, pk=None):
        cart = self.get_cart()
        if request.method == 'PUT':
            cart_item = get_object_or_404(
                CartItem,
                cart=cart,
                id=item_id
            )
            serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
    
            cart_item = get_object_or_404(
                CartItem,
                cart=cart,
                id=item_id
            )
            cart_item.delete()
            return Response({'status': 'Item removed from cart'})

        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)




class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Create an order from the user's cart within a database transaction.
        """
        # Start a database transaction
        with transaction.atomic():
            # Get the user's cart
            cart = get_object_or_404(Cart, user=request.user)

            # Ensure the cart is not empty
            if not cart.items.exists():
                return Response(
                    {'error': 'Cannot create order from an empty cart'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate and create the order using the serializer
            # import pdb;pdb.set_trace()
            serializer = self.get_serializer(data=request.data, context={'user': request.user})
            if serializer.is_valid():
                # Save the order with subtotal from the cart
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

                # Clear the cart after creating the order
                cart.items.all().delete()

                # Return the created order
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            # If the serializer is invalid, return validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing order. Supports both full and partial updates.
        """
        # Start a database transaction
        with transaction.atomic():
            # Get the order instance
            instance = self.get_object()

            # Check if the order can be updated (e.g., not completed or canceled)
            if instance.status in ['completed', 'canceled']:
                return Response(
                    {'error': 'This order cannot be updated because it is already completed or canceled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )


            # Validate the updated data
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={'user': request.user})
            if serializer.is_valid():
                # Save the updated order
                order = serializer.save()

                # Optionally handle updates to order items here
                # For example, you could allow adding/removing/modifying order items

                return Response(serializer.data, status=status.HTTP_200_OK)

            # Return validation errors if the serializer is invalid
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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

