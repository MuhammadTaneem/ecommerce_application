INSERT INTO "products_variantattribute" ("id", "name", "slug") VALUES (1, 'Color', 'color');
INSERT INTO "products_variantattribute" ("id", "name", "slug") VALUES (2, 'Size', 'size');
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (1, 'red', 1);
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (2, 'green', 1);
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (3, 'black', 1);
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (4, 'l', 2);
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (5, 'm', 2);
INSERT INTO "products_variantvalue" ("id", "value", "attribute_id") VALUES (6, 's', 2);
INSERT INTO "core_user" ("id", "password", "is_superuser", "first_name", "last_name", "email", "phone", "is_active", "is_staff", "is_verified", "last_login", "avatar", "role_id", "permissions", "created_at", "updated_at") VALUES (1, 'pbkdf2_sha256$870000$vcePrEqgnlqecCaKavFYs9$Tq4P5w5/+0nNc0qh45GuG2OK1jRxKo7MQVDAlxxuOm8=', 'f', 'muhammad', 'taneem', 'taneem71@gmail.com', NULL, 'f', 'f', 'f', NULL, '', 1, '[]', '2025-01-07 03:34:58.267829+00', '2025-01-07 03:34:59.017265+00');
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (1, 'man', 'man', NULL, '', NULL);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (2, 'woman', 'woman', NULL, '', NULL);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (3, 'shirt', 'man_shirt', NULL, '', 1);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (4, 'shirt', 'woman_shirt', NULL, '', 2);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (5, 'pant', 'woman_pant', NULL, '', 2);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (6, 'pant', 'man_pant', NULL, '', 1);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (7, 'formal', 'man_shirt_formal', NULL, '', 3);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (8, 'casual', 'man_shirt_casual', NULL, '', 3);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (9, 'casual', 'man_pant_casual', NULL, '', 6);
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id") VALUES (10, 'formal', 'man_pant_formal', NULL, '', 6);
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (1, 'green shirt', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:39:38.367779+00', 't', 'f', '2025-01-09 04:39:38.367796+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (2, 'red pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-07 06:13:24.580382+00', 't', 'f', '2025-01-07 06:13:24.580396+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (3, 'black shirt', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:39:53.331033+00', 't', 'f', '2025-01-09 04:39:53.331045+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (4, 'black pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:41:24.015994+00', 't', 'f', '2025-01-09 04:41:24.016008+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (5, 'green pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:41:30.118316+00', 't', 'f', '2025-01-09 04:41:30.118329+00');



INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (2, 'red pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-07 06:13:24.580382+00', 't', 'f', '2025-01-07 06:13:24.580396+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (1, 'green shirt', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:39:38.367779+00', 't', 'f', '2025-01-09 04:39:38.367796+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (3, 'black shirt', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:39:53.331033+00', 't', 'f', '2025-01-09 04:39:53.331045+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (4, 'black pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:41:24.015994+00', 't', 'f', '2025-01-09 04:41:24.016008+00');
INSERT INTO "products_product" ("id", "name", "base_price", "stock_quantity", "has_variants", "short_description", "discount_price", "key_features", "description", "additional_info", "category_id", "created_at", "is_active", "is_deleted", "updated_at") VALUES (5, 'green pant', '130.00', 12, 't', NULL, NULL, '{}', '{}', '{}', 4, '2025-01-09 04:41:30.118316+00', 't', 'f', '2025-01-09 04:41:30.118329+00');


INSERT INTO "products_sku" ("id", "sku_code", "price", "stock_quantity", "product_id", "discount_price") VALUES (1, 'fd09a471-8a65-4938-9e98-42d4d8a9640b', '123.00', 12, 1, '0.00');
INSERT INTO "products_sku" ("id", "sku_code", "price", "stock_quantity", "product_id", "discount_price") VALUES (2, 'dd9152d4-e3bb-4602-b20c-cf8da16b13c6', '123.00', 12, 3, '0.00');
INSERT INTO "products_sku" ("id", "sku_code", "price", "stock_quantity", "product_id", "discount_price") VALUES (3, '32bae4fa-aa6a-44dd-97e4-86e97e55675e', '123.00', 12, 4, '0.00');
INSERT INTO "products_sku" ("id", "sku_code", "price", "stock_quantity", "product_id", "discount_price") VALUES (4, 'ee1ff8bc-f07f-4d0f-a492-057f69cab760', '123.00', 12, 5, '0.00');


INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (1, 1, 3);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (2, 1, 6);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (3, 2, 3);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (4, 2, 6);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (5, 3, 3);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (6, 3, 6);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (7, 4, 3);
INSERT INTO "products_sku_variants" ("id", "sku_id", "variantvalue_id") VALUES (8, 4, 6);
