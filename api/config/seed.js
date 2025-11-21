// node config/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Egyptian Cities with coordinates
const egyptCities = [
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Alexandria", lat: 31.2001, lng: 29.9187 },
  { name: "Giza", lat: 30.0131, lng: 31.2089 },
  { name: "Sharm El Sheikh", lat: 27.9158, lng: 34.33 },
  { name: "Hurghada", lat: 27.2579, lng: 33.8116 },
  { name: "Luxor", lat: 25.6872, lng: 32.6396 },
  { name: "Aswan", lat: 24.0889, lng: 32.8998 },
  { name: "Port Said", lat: 31.2653, lng: 32.3019 },
  { name: "Suez", lat: 29.9668, lng: 32.5498 },
  { name: "Mansoura", lat: 31.0409, lng: 31.3785 },
];

// Egyptian Restaurants Data
const egyptRestaurants = [
  {
    name: "كشري أبو طارق",
    description: "أشهر كشري في مصر - تقديم الكشري المصري الأصيل",
    imgUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
    address: "شارع رمسيس، وسط البلد",
    phoneNumber: "+20 2 2345 6789",
    deliveryTime: "20-30 دقيقة",
    deliveryFee: 15.0,
    minOrder: 50.0,
    rating: 4.8,
  },
  {
    name: "مطعم الشبراوي",
    description: "مشويات مصرية وشرقية فاخرة",
    imgUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
    address: "شارع الهرم، الجيزة",
    phoneNumber: "+20 2 3345 6789",
    deliveryTime: "35-45 دقيقة",
    deliveryFee: 20.0,
    minOrder: 100.0,
    rating: 4.7,
  },
  {
    name: "فلفلة السورية",
    description: "أكلات سورية ومصرية شهية",
    imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    address: "شارع جامعة الدول العربية، المهندسين",
    phoneNumber: "+20 2 3745 6789",
    deliveryTime: "30-40 دقيقة",
    deliveryFee: 18.0,
    minOrder: 80.0,
    rating: 4.6,
  },
  {
    name: "سي جل للمأكولات البحرية",
    description: "أطيب سمك وجمبري طازج على البحر",
    imgUrl: "https://images.unsplash.com/photo-1559737558-2f5a35f4523e?w=500",
    address: "كورنيش الإسكندرية",
    phoneNumber: "+20 3 4567 8901",
    deliveryTime: "40-50 دقيقة",
    deliveryFee: 25.0,
    minOrder: 150.0,
    rating: 4.9,
  },
  {
    name: "طاجن المندرة",
    description: "أشهى الطواجن المصرية بجميع أنواعها",
    imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    address: "المندرة، الإسكندرية",
    phoneNumber: "+20 3 5567 8901",
    deliveryTime: "35-45 دقيقة",
    deliveryFee: 20.0,
    minOrder: 90.0,
    rating: 4.7,
  },
  {
    name: "بيتزا كينج",
    description: "بيتزا إيطالية بنكهة مصرية",
    imgUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    address: "شارع فيصل، الجيزة",
    phoneNumber: "+20 2 3845 6789",
    deliveryTime: "25-35 دقيقة",
    deliveryFee: 15.0,
    minOrder: 60.0,
    rating: 4.5,
  },
  {
    name: "مطعم الفلاح",
    description: "فول وطعمية وفطار بلدي أصيل",
    imgUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
    address: "حي مصر الجديدة، القاهرة",
    phoneNumber: "+20 2 2645 6789",
    deliveryTime: "15-25 دقيقة",
    deliveryFee: 10.0,
    minOrder: 30.0,
    rating: 4.6,
  },
  {
    name: "برجر بيت",
    description: "برجر وساندويتشات أمريكية بطعم مصري",
    imgUrl: "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=500",
    address: "شارع التسعين، التجمع الخامس",
    phoneNumber: "+20 2 2745 6789",
    deliveryTime: "30-40 دقيقة",
    deliveryFee: 20.0,
    minOrder: 70.0,
    rating: 4.4,
  },
  {
    name: "حلويات الشرق",
    description: "بسبوسة وكنافة وحلويات شرقية",
    imgUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
    address: "شارع الحجاز، مصر الجديدة",
    phoneNumber: "+20 2 2545 6789",
    deliveryTime: "20-30 دقيقة",
    deliveryFee: 15.0,
    minOrder: 50.0,
    rating: 4.8,
  },
  {
    name: "مطعم النيل",
    description: "أكلات مصرية تقليدية مع إطلالة على النيل",
    imgUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    address: "كورنيش النيل، المعادي",
    phoneNumber: "+20 2 2845 6789",
    deliveryTime: "40-50 دقيقة",
    deliveryFee: 25.0,
    minOrder: 120.0,
    rating: 4.9,
  },
];

// Categories with Egyptian products
const categoriesData = [
  {
    name: "المقبلات والمشهيات",
    description: "أشهى المقبلات لبداية وجبتك",
    imgUrl:
      "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500",
    products: [
      {
        name: "سلطة خضراء",
        description: "سلطة طازجة بالخضروات الموسمية",
        quantity: 300,
        price: 25.0,
        imgUrl:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
      },
      {
        name: "حمص بالطحينة",
        description: "حمص كريمي مع الطحينة والليمون",
        quantity: 250,
        price: 30.0,
        imgUrl:
          "https://images.unsplash.com/photo-1630409346693-a6f4b0c24e00?w=400",
      },
      {
        name: "بابا غنوج",
        description: "باذنجان مشوي بالطحينة",
        quantity: 220,
        price: 35.0,
        imgUrl:
          "https://images.unsplash.com/photo-1593001874117-4b94de839161?w=400",
      },
      {
        name: "سمبوسك باللحمة",
        description: "سمبوسك محشي لحم مفروم مع البهارات",
        quantity: 200,
        price: 40.0,
        imgUrl:
          "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
      },
      {
        name: "محشي ورق عنب",
        description: "ورق عنب محشي بالأرز والخلطة",
        quantity: 180,
        price: 45.0,
        imgUrl:
          "https://images.unsplash.com/photo-1602524206684-bc8e9a4d1b8e?w=400",
      },
      {
        name: "فتوش",
        description: "سلطة فتوش بالخبز المحمص",
        quantity: 240,
        price: 30.0,
        imgUrl:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      },
      {
        name: "طبق مخلل",
        description: "مخللات متنوعة مصرية",
        quantity: 300,
        price: 20.0,
        imgUrl:
          "https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400",
      },
    ],
  },
  {
    name: "الأطباق الرئيسية",
    description: "أطباق رئيسية شهية ومشبعة",
    imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    products: [
      {
        name: "كشري مصري",
        description: "الكشري المصري الأصيل بكل مكوناته",
        quantity: 400,
        price: 40.0,
        imgUrl:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      },
      {
        name: "فتة باللحمة",
        description: "فتة مصرية بالخبز والأرز واللحم",
        quantity: 250,
        price: 80.0,
        imgUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      },
      {
        name: "محشي كوسة ورقائق",
        description: "محشي متنوع بالأرز واللحمة",
        quantity: 200,
        price: 70.0,
        imgUrl:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
      },
      {
        name: "مسقعة باذنجان",
        description: "مسقعة مصرية باللحمة المفرومة",
        quantity: 220,
        price: 65.0,
        imgUrl:
          "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400",
      },
      {
        name: "كباب حلة",
        description: "كباب باللحم الضاني في الحلة",
        quantity: 180,
        price: 120.0,
        imgUrl:
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400",
      },
      {
        name: "سمك مقلي",
        description: "سمك بلطي مقلي مع الأرز",
        quantity: 200,
        price: 90.0,
        imgUrl:
          "https://images.unsplash.com/photo-1559737558-2f5a35f4523e?w=400",
      },
      {
        name: "فراخ مشوية",
        description: "نصف فرخة مشوية مع الأرز",
        quantity: 250,
        price: 85.0,
        imgUrl:
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
      },
    ],
  },
  {
    name: "الحلويات والمشروبات",
    description: "حلويات شرقية ومشروبات منعشة",
    imgUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
    products: [
      {
        name: "بسبوسة",
        description: "بسبوسة محلاة بالقطر",
        quantity: 300,
        price: 35.0,
        imgUrl:
          "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400",
      },
      {
        name: "كنافة بالقشطة",
        description: "كنافة ساخنة محشوة بالقشطة",
        quantity: 250,
        price: 50.0,
        imgUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      },
      {
        name: "أم علي",
        description: "حلى أم علي الساخن بالمكسرات",
        quantity: 220,
        price: 45.0,
        imgUrl:
          "https://images.unsplash.com/photo-1606890737921-848f703ab54d?w=400",
      },
      {
        name: "قطايف بالمكسرات",
        description: "قطايف محشوة بالمكسرات",
        quantity: 200,
        price: 40.0,
        imgUrl:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      },
      {
        name: "مهلبية",
        description: "مهلبية باللبن والنشا",
        quantity: 280,
        price: 30.0,
        imgUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      },
      {
        name: "عصير قصب",
        description: "عصير قصب طازج طبيعي",
        quantity: 350,
        price: 15.0,
        imgUrl:
          "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
      },
      {
        name: "خشاف",
        description: "خشاف رمضاني بالفواكه المجففة",
        quantity: 200,
        price: 25.0,
        imgUrl:
          "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400",
      },
    ],
  },
];

async function seedEgyptRestaurants() {
  try {
    console.log("🇪🇬 بدء إنشاء المطاعم المصرية...\n");

    for (let i = 0; i < egyptRestaurants.length; i++) {
      const restaurantData = egyptRestaurants[i];
      const city = egyptCities[i % egyptCities.length];

      // Add slight random offset to coordinates for variety
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;

      console.log(`📍 إنشاء مطعم: ${restaurantData.name} في ${city.name}`);

      // Create restaurant
      const restaurant = await prisma.restaurant.create({
        data: {
          name: restaurantData.name,
          description: restaurantData.description,
          imgUrl: restaurantData.imgUrl,
          address: restaurantData.address,
          city: city.name,
          latitude: city.lat + latOffset,
          longitude: city.lng + lngOffset,
          phoneNumber: restaurantData.phoneNumber,
          rating: restaurantData.rating,
          deliveryTime: restaurantData.deliveryTime,
          deliveryFee: restaurantData.deliveryFee,
          minOrder: restaurantData.minOrder,
          isActive: true,
        },
      });

      console.log(`✅ تم إنشاء المطعم: ${restaurant.name} (${restaurant.id})`);

      // Create categories and products for this restaurant
      for (const categoryData of categoriesData) {
        const category = await prisma.productCategory.create({
          data: {
            name: categoryData.name,
            description: categoryData.description,
            imgUrl: categoryData.imgUrl,
            restaurantId: restaurant.id,
          },
        });

        console.log(`   ✨ تم إنشاء القسم: ${category.name}`);

        // Create products for this category
        for (const productData of categoryData.products) {
          await prisma.product.create({
            data: {
              name: productData.name,
              description: productData.description,
              quantity: productData.quantity,
              price: productData.price,
              imgUrl: productData.imgUrl,
              isAvailable: true,
              restaurantId: restaurant.id,
              categoryId: category.id,
            },
          });

          console.log(`      🍽️  تم إضافة المنتج: ${productData.name}`);
        }
      }

      console.log(`✅ اكتمل: ${restaurant.name} مع 3 أقسام و 21 منتج\n`);
    }

    console.log("🎉 تم إنشاء جميع المطاعم المصرية بنجاح!");
    console.log(
      `📊 الإجمالي: ${egyptRestaurants.length} مطعم في ${egyptCities.length} مدينة مصرية`
    );
  } catch (error) {
    console.error("❌ خطأ في إنشاء المطاعم المصرية:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedEgyptRestaurants().catch((error) => {
  console.error(error);
  process.exit(1);
});
