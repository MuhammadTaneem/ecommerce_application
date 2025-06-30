-- category
INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (1, 'man', 'man', 'Category for men', '', NULL);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (2, 'woman', 'woman', 'Category for women', '', NULL);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (3, 'shirt', 'man-shirt', 'Men''s shirts', '', 1);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (4, 'shirt', 'woman-shirt', 'Women''s shirts', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (5, 'pant', 'woman-pant', 'Women''s pants', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (6, 'pant', 'man-pant', 'Men''s pants', '', 1);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (7, 'formal', 'man-shirt-formal', 'Formal shirts for men', '', 3);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (8, 'casual', 'man-shirt-casual', 'Casual shirts for men', '', 3);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (9, 'casual', 'man-pant-casual', 'Casual pants for men', '', 6);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (10, 'formal', 'man-pant-formal', 'Formal pants for men', '', 6);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (11, 'dress', 'woman-dress', 'Women''s dresses', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (12, 'skirt', 'woman-skirt', 'Women''s skirts', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (13, 't-shirt', 'man-tshirt', 'Men''s T-shirts', '', 1);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (14, 't-shirt', 'woman-tshirt', 'Women''s T-shirts', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (15, 'jeans', 'man-jeans', 'Men''s jeans', '', 1);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (16, 'jeans', 'woman-jeans', 'Women''s jeans', '', 2);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (17, 'formal', 'woman-dress-formal', 'Formal dresses for women', '', 11);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (18, 'casual', 'woman-dress-casual', 'Casual dresses for women', '', 11);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (19, 'mini', 'woman-skirt-mini', 'Mini skirts for women', '', 12);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (20, 'pencil', 'woman-skirt-pencil', 'Pencil skirts for women', '', 12);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (21, 'graphic', 'man-tshirt-graphic', 'Graphic T-shirts for men', '', 13);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (22, 'plain', 'man-tshirt-plain', 'Plain T-shirts for men', '', 13);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (23, 'graphic', 'woman-tshirt-graphic', 'Graphic T-shirts for women', '', 14);

INSERT INTO "products_category" ("id", "label", "slug", "description", "image", "parent_id")
VALUES (24, 'plain', 'woman-tshirt-plain', 'Plain T-shirts for women', '', 14);
SELECT setval('products_category_id_seq', (SELECT MAX(id) FROM products_category));






--tags
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Regular Fit', 'regular-fit', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Slim Fit', 'slim-fit', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Relaxed Fit', 'relaxed-fit', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Loose Fit', 'loose-fit', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Oversized', 'oversized', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Skinny Fit', 'skinny-fit', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('High Waist', 'high-waist', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Mid Waist', 'mid-waist', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Low Waist', 'low-waist', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Full Sleeve', 'full-sleeve', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Half Sleeve', 'half-sleeve', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Sleeveless', 'sleeveless', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Three Quarter Sleeve', 'three-quarter-sleeve', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Side Open', 'side-open', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Front Open', 'front-open', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Back Open', 'back-open', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Buttoned', 'buttoned', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Zippered', 'zippered', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Drawstring', 'drawstring', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Elastic Waist', 'elastic-waist', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('High Neck', 'high-neck', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Round Neck', 'round-neck', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('V-Neck', 'v-neck', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Collar Neck', 'collar-neck', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Off Shoulder', 'off-shoulder', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Crop', 'crop', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Ankle Length', 'ankle-length', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Knee Length', 'knee-length', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Full Length', 'full-length', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Shorts', 'shorts', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Capri', 'capri', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Flared', 'flared', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Straight Cut', 'straight-cut', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Bootcut', 'bootcut', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Tapered', 'tapered', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Stretchable', 'stretchable', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Non-Stretch', 'non-stretch', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Printed', 'printed', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Solid', 'solid', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Striped', 'striped', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Checked', 'checked', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Embroidered', 'embroidered', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Lace', 'lace', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Denim', 'denim', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Cotton', 'cotton', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Silk', 'silk', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Linen', 'linen', NOW(), NOW());
INSERT INTO products_tag (name, slug, created_at, updated_at) VALUES ('Satin', 'satin', NOW(), NOW());

SELECT setval('products_tag_id_seq', (SELECT MAX(id) FROM products_tag));



-- brand
INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Nike', 'Global sportswear brand known for athletic shoes, apparel, and equipment.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Adidas', 'German multinational brand designing sports clothing and accessories.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Puma', 'Brand offering casual and athletic footwear, apparel, and accessories.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Levi''s', 'Renowned for denim jeans and other casual wear products.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('H&M', 'Swedish fast-fashion brand offering trendy clothing at affordable prices.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Zara', 'Spanish brand known for stylish clothing collections for men, women, and kids.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Uniqlo', 'Japanese casual wear designer, manufacturer, and retailer.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Gucci', 'Luxury Italian fashion brand known for high-end clothing and accessories.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Louis Vuitton', 'French luxury fashion house known for bags, shoes, and apparel.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Under Armour', 'American brand offering innovative athletic performance gear.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Reebok', 'Sportswear brand known for fitness and lifestyle clothing and footwear.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Fila', 'Heritage athletic brand offering retro-inspired sports fashion.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('New Balance', 'American sports footwear and apparel brand.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Tommy Hilfiger', 'Classic American cool style with preppy and premium clothing.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Calvin Klein', 'American brand known for minimalistic, high-quality fashion.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Guess', 'Global lifestyle brand known for denim, accessories, and youthful style.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Mango', 'Spanish fashion brand offering modern and urban clothing.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Diesel', 'Italian brand known for its denim and contemporary styles.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('ASOS', 'British online fashion and cosmetic retailer for young adults.', NOW(), NOW());

INSERT INTO products_brand (name, description, created_at, updated_at) VALUES 
('Balenciaga', 'Luxury fashion house known for bold and innovative designs.', NOW(), NOW());

-- Reset the sequence to the current max id
SELECT setval('products_brand_id_seq', (SELECT MAX(id) FROM products_brand));


-- variants attr 
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (1, 'Color', 'color');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (2, 'Size', 'size');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (3, 'Material', 'material');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (4, 'Fit', 'fit');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (5, 'Sleeve Length', 'sleeve-length');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (6, 'Pattern', 'pattern');
INSERT INTO public.products_variantattribute (id, name, slug) VALUES (7, 'Gender', 'gender');
SELECT setval('products_variantattribute_id_seq', (SELECT MAX(id) FROM products_variantattribute));

-- variants value
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (1, 'Red', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (2, 'Blue', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (3, 'Green', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (4, 'Yellow', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (5, 'Black', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (6, 'White', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (7, 'Purple', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (8, 'Orange', 1);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (9, 'XS', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (10, 'S', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (11, 'M', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (12, 'L', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (13, 'XL', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (14, 'XXL', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (15, '3XL', 2);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (16, 'Cotton', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (17, 'Polyester', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (18, 'Linen', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (19, 'Silk', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (20, 'Wool', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (21, 'Denim', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (22, 'Rayon', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (23, 'Viscose', 3);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (24, 'Regular Fit', 4);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (25, 'Slim Fit', 4);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (26, 'Relaxed Fit', 4);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (27, 'Oversized', 4);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (28, 'Loose Fit', 4);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (29, 'Full Sleeve', 5);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (30, 'Half Sleeve', 5);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (31, 'Sleeveless', 5);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (32, 'Three Quarter Sleeve', 5);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (33, 'Solid', 6);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (34, 'Striped', 6);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (35, 'Checked', 6);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (36, 'Printed', 6);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (37, 'Embroidered', 6);
INSERT INTO public.products_variantvalue (id, value, attribute_id) VALUES (38, 'Floral', 6);

SELECT setval('products_variantvalue_id_seq', (SELECT MAX(id) FROM products_variantvalue));


-- user
INSERT INTO "core_user" ("id", "password", "is_superuser", "first_name", "last_name", "email", "phone", "is_active", "is_staff", "is_verified", "last_login", "avatar", "role_id", "permissions", "created_at", "updated_at") VALUES (1, 'pbkdf2_sha256$870000$vcePrEqgnlqecCaKavFYs9$Tq4P5w5/+0nNc0qh45GuG2OK1jRxKo7MQVDAlxxuOm8=', 'f', 'muhammad', 'taneem', 'taneem71@gmail.com', NULL, 'f', 'f', 'f', NULL, '', 1, '[]', '2025-01-07 03:34:58.267829+00', '2025-01-07 03:34:59.017265+00');

