package com.example.bulkyo.data

object SampleData {
    val eventTypes = EventType.entries

    val indianLocations = listOf(
        "Hyderabad", "Vijayawada", "Visakhapatnam", "Guntur", "Nellore", 
        "Tirupati", "Warangal", "Kurnool", "Rajahmundry", "Kakinada"
    )

    private val teluguCatererNames = listOf(
        "Sravani Vindu Bhojanam", "Annapurna Catering Services", "Godavari Ruchulu", 
        "Palle Vindu", "Sri Venkateswara Catering", "Andhra Maala", 
        "Rayalaseema Ruchulu", "Telangana Vindu", "Amma Chethi Vanta", 
        "Dakshin Catering", "Kosta Ruchulu", "Bhimavaram Ruchulu",
        "Sitara Vindu", "Mayuri Catering", "Ulavacharu Catering",
        "Kritunga Vindu", "Subbayya Gari Hotel Catering", "Vantillu Services",
        "Ruchi Abhiruchi", "Swaad Catering"
    )

    private val welcomeDrinks = mapOf(
        "Mint Mojito" to "cocktail,mint",
        "Fruit Punch" to "juice,fruit",
        "Rose Milk" to "milkshake,pink",
        "Masala Buttermilk" to "yogurt,drink",
        "Badam Milk" to "milk,yellow,nuts"
    )

    private val starters = mapOf(
        "Paneer Tikka" to "paneer,tikka,grilled",
        "Veg Manchurian" to "manchurian,balls,gravy",
        "Chicken 65" to "fried,chicken,red,spicy",
        "Spring Rolls" to "spring,rolls,fried",
        "Gobi 65" to "cauliflower,fried,spicy",
        "Baby Corn Manchurian" to "babycorn,fry,chinese",
        "Seekh Kabab" to "kabab,grilled,meat",
        "Hara Bhara Kabab" to "kabab,green,veg",
        "Mirchi Bajji" to "chilli,fritters,indian",
        "Punugulu" to "snack,fried,indian"
    )

    private val mainCourseRice = mapOf(
        "Hyderabadi Dum Biryani" to "biryani,hyderabad,indian",
        "Bagara Rice" to "rice,indian,spices",
        "Jeera Rice" to "rice,cumin",
        "Veg Pulav" to "rice,vegetables",
        "Mutton Biryani" to "biryani,meat,spicy",
        "Curd Rice" to "rice,curd,pomegranate",
        "Sambar Rice" to "rice,lentil,stew",
        "Pulihora" to "tamarind,rice,indian",
        "Avakaya Annam" to "mango,pickle,rice,indian"
    )

    private val mainCourseCurries = mapOf(
        "Kadai Paneer" to "paneer,curry,spicy",
        "Dal Tadka" to "lentils,yellow,tempering",
        "Mixed Veg Curry" to "vegetables,curry",
        "Gutti Vankaya Kura" to "eggplant,curry,indian",
        "Mirchi Ka Salan" to "chilli,curry,hyderabad",
        "Natukodi Pulusu" to "chicken,curry,indian,spicy",
        "Dal Makhani" to "lentils,black,creamy",
        "Butter Chicken" to "chicken,curry,creamy"
    )

    private val sweets = mapOf(
        "Double Ka Meetha" to "bread,pudding,sweet",
        "Qubani Ka Meetha" to "apricot,sweet,dessert",
        "Gulab Jamun" to "sweet,balls,syrup",
        "Rasmalai" to "sweet,milk,creamy",
        "Jalebi" to "sweet,spiral,orange",
        "Badam Halwa" to "pudding,almond,sweet",
        "Pootharekulu" to "sweet,paper,rice,indian",
        "Ariselu" to "sweet,jaggery,indian",
        "Bobbatlu" to "sweet,flatbread,indian"
    )

    private val dishImageKeywords = welcomeDrinks + starters + mainCourseRice + mainCourseCurries + sweets

    private fun getImageUrlForDish(name: String): String {
        val keyword = dishImageKeywords[name] ?: "indian,food,cuisine"
        return "https://source.unsplash.com/featured/400x400/?$keyword"
    }

    private fun getImageUrlForCaterer(name: String): String {
        val keyword = when {
            name.contains("Vindu") || name.contains("Bhojanam") || name.contains("Ruchulu") -> "thali,indian,feast"
            name.contains("Catering") -> "catering,buffet,event"
            else -> "indian,restaurant,kitchen"
        }
        return "https://source.unsplash.com/featured/800x600/?$keyword"
    }

    fun generateMenu(location: String): List<MenuItem> {
        val allDishes = mutableListOf<MenuItem>()
        
        // Ensure every menu has items from all categories
        welcomeDrinks.forEach { (name, _) ->
            allDishes.add(createMenuItem(name, "Welcome Drinks", 50.0, 150.0))
        }
        starters.forEach { (name, _) ->
            allDishes.add(createMenuItem(name, "Starters", 150.0, 450.0))
        }
        mainCourseRice.forEach { (name, _) ->
            allDishes.add(createMenuItem(name, "Main Course (Rice)", 200.0, 600.0))
        }
        mainCourseCurries.forEach { (name, _) ->
            allDishes.add(createMenuItem(name, "Main Course (Curries)", 150.0, 500.0))
        }
        sweets.forEach { (name, _) ->
            allDishes.add(createMenuItem(name, "Sweets & Desserts", 100.0, 400.0))
        }
        
        // Randomize the order but keep categories if needed
        return allDishes.shuffled().take(100)
    }

    private fun createMenuItem(name: String, category: String, minPrice: Double, maxPrice: Double): MenuItem {
        return MenuItem(
            id = "item_${name.replace(" ", "_").lowercase()}_${(1000..9999).random()}",
            name = name,
            description = "Traditional $name, a must-have for grand Indian weddings and functions.",
            price = (minPrice.toInt()..maxPrice.toInt()).random().toDouble(), // Cost in Rupees per plate
            category = category,
            imageUrl = getImageUrlForDish(name)
        )
    }

    private val indianCustomerNames = listOf(
        "Ramesh Kumar", "Suresh Babu", "Venkatesh Rao", "Mrudula", "Anitha Reddy",
        "Priya Lakshmi", "Rajeshwari Devi", "Karthik Raja", "Manish Varma", "Deepika Rao",
        "Satish Chandra", "Padma Rao", "Naveen Prasad", "Sandhya Rani", "Vijay Kumar",
        "Laxmi Narayana", "Aruna Kumari", "Mohan Babu", "Sita Mahalakshmi", "Bhanu Prasad"
    )

    private val sampleComments = listOf(
        "Excellent food and service! The biryani was outstanding.",
        "Very professional catering. Perfect for our marriage function.",
        "Food was delicious, but delivery was slightly late.",
        "Great taste, authentic Telugu flavors. Highly recommended!",
        "The sweets were amazing. Pootharekulu was the highlight.",
        "Good experience overall. Capacity was handled well.",
        "Impressive menu variety. My guests loved the starters.",
        "Reliable and high quality. Will definitely book again."
    )

    private fun generateReviews(): List<Review> {
        return (1..3).map { i ->
            Review(
                id = "rev_${System.currentTimeMillis()}_$i",
                userName = indianCustomerNames.random(),
                rating = (4..5).random(),
                comment = sampleComments.random(),
                date = "June ${i + 10}, 2026"
            )
        }
    }

    val caterers = (1..200).map { i ->
        val location = indianLocations.random()
        val nameBase = teluguCatererNames.random()
        val businessName = if (i > teluguCatererNames.size) "$nameBase $i" else nameBase
        
        Caterer(
            id = "caterer_$i",
            userId = "user_cat_$i",
            businessName = businessName,
            menu = generateMenu(location),
            minCapacity = 10,
            maxCapacity = 2000,
            location = location,
            rating = (35..50).random().toFloat() / 10f,
            fssaiNumber = "FSSAI-${(10000000000000..99999999999999).random()}",
            imageUrl = getImageUrlForCaterer(businessName),
            reviews = generateReviews()
        )
    }

    val customers = (1..100).map { i ->
        val name = if (i <= indianCustomerNames.size) indianCustomerNames[i-1] else "${indianCustomerNames.random()} $i"
        User(
            id = "customer_$i",
            name = name,
            email = "${name.replace(" ", ".").lowercase()}@example.com",
            role = UserRole.CUSTOMER,
            location = indianLocations.random()
        )
    }
}
