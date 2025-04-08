export const Q1_DESC = 'Programmatically navigate using React router';
export const Q1_TXT =
  'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.';

export const Q2_DESC =
  'android studio save string shared preference, start activity and load the saved string';
export const Q2_TXT =
  'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.';

export const Q3_DESC = 'Object storage for a web application';
export const Q3_TXT =
  'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.';

export const Q4_DESC = 'Quick question about storage on android';
export const Q4_TXT =
  'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains';

export const Q5_DESC = 'How to substitute eggs in baking?';
export const Q5_TXT =
  'I am trying to bake a cake, but I ran out of eggs. What are the best alternatives I can use that will still maintain the texture and flavor of the cake?';

export const Q6_DESC = 'How to thicken a sauce without flour?';
export const Q6_TXT =
  'I am making a pasta sauce but I want to avoid using flour as a thickener. What are some good alternatives that will not alter the taste too much?';

export const Q7_DESC = 'Best way to store fresh herbs?';
export const Q7_TXT =
  'I often buy fresh herbs like cilantro and basil, but they wilt quickly in my fridge. What is the best way to store them so they last longer?';

export const Q8_DESC = 'How to balance flavors in a dish?';
export const Q8_TXT =
  'Sometimes when I cook, my dish turns out too sweet, salty, or acidic. What are the best ways to adjust the balance of flavors when this happens?';

export const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
export const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";
export const A3_TXT =
  'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.';
export const A4_TXT =
  'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);';
export const A5_TXT = 'I just found all the above examples just too confusing, so I wrote my own.';
export const A6_TXT = 'Storing content as BLOBs in databases.';
export const A7_TXT = 'Using GridFS to chunk and store content.';
export const A8_TXT = 'Store data in a SQLLite database.';
export const Q5A_TXT =
  'When substituting eggs in baking, you need to consider the role eggs play in the recipe—whether it is binding, leavening, or moisture. Common substitutes include mashed bananas, applesauce, yogurt, or flaxseed mixed with water. For leavening, baking soda and vinegar can work as well.';
export const Q6A_TXT =
  'Cornstarch, arrowroot powder, and puréed vegetables like potatoes or cauliflower are great alternatives to flour for thickening sauces. You can also reduce the sauce by simmering it longer to naturally thicken it without adding extra ingredients.';
export const Q7A_TXT =
  'To keep fresh herbs from wilting quickly, store them in a damp paper towel inside an airtight container in the fridge. For herbs like basil, keeping them in a glass of water at room temperature works better.';
export const Q8A_TXT =
  'Balancing flavors is about understanding contrasts: too much sweetness can be cut with acidity (like lemon juice or vinegar), while excessive saltiness can be counteracted with a bit of sugar or dairy. When a dish is too bland, try adding umami-rich ingredients like soy sauce, mushrooms, or miso.';

export const T1_NAME = 'react';
export const T1_DESC =
  'React is a JavaScript-based UI development library. Although React is a library rather than a language, it is widely used in web development. The library first appeared in May 2013 and is now one of the most commonly used frontend libraries for web development.';

export const T2_NAME = 'javascript';
export const T2_DESC =
  'JavaScript is a versatile programming language primarily used in web development to create interactive effects within web browsers. It was initially developed by Netscape as a means to add dynamic and interactive elements to websites.';

export const T3_NAME = 'android-studio';
export const T3_DESC =
  "Android Studio is the official Integrated Development Environment (IDE) for Google's Android operating system. It is built on JetBrains' IntelliJ IDEA software and is specifically designed for Android development.";

export const T4_NAME = 'shared-preferences';
export const T4_DESC =
  'SharedPreferences is an Android API that allows for simple data storage in the form of key-value pairs. It is commonly used for storing user settings, configuration, and other small pieces of data.';

export const T5_NAME = 'storage';
export const T5_DESC =
  'Storage refers to the various methods and technologies used to store digital data. This can include local storage, cloud storage, databases, file systems, and more, depending on the context.';

export const T6_NAME = 'website';
export const T6_DESC =
  'A website is a collection of interlinked web pages, typically identified with a common domain name, and published on at least one web server. Websites can serve various purposes, such as information sharing, entertainment, commerce, and social networking.';

export const T7_NAME = 'baking';
export const T7_DESC =
  'Baking is a method of cooking that uses dry heat, typically in an oven, to cook food such as bread, cakes, and pastries. It requires precise measurements and temperature control to achieve the desired texture and flavor.';

export const T8_NAME = 'spices';
export const T8_DESC =
  'Spices are aromatic substances derived from plants that enhance the flavor, color, and aroma of food. Common spices include cinnamon, cumin, turmeric, and paprika, each with unique culinary uses.';

export const T9_NAME = 'fermentation';
export const T9_DESC =
  'Fermentation is a process in which microorganisms like yeast and bacteria convert carbohydrates into alcohol or acids. This technique is used in making bread, yogurt, kimchi, and many other fermented foods.';

export const T10_NAME = 'knife-skills';
export const T10_DESC =
  'Knife skills are essential for efficient and safe food preparation. Techniques such as dicing, julienning, and chiffonade help improve consistency and presentation in cooking.';

export const T11_NAME = 'meal-prep';
export const T11_DESC =
  'Meal prep is the practice of preparing meals or ingredients in advance to save time and effort throughout the week. It involves planning, portioning, and storing food to make cooking more efficient.';

export const T12_NAME = 'umami';
export const T12_DESC =
  'Umami is the fifth basic taste, often described as savory or meaty. It is found in ingredients such as mushrooms, tomatoes, soy sauce, and Parmesan cheese, enhancing the depth of flavor in dishes.';

export const T13_NAME = 'DR-Gluten-free';
export const T13_DESC = 'Recipes that do not contain gluten.';
export const T14_NAME = 'DR-Vegetarian';
export const T14_DESC = 'Recipes that do not contain meat.';
export const T15_NAME = 'DR-Vegan';
export const T15_DESC = 'Recipes that do not contain any animal products.';
export const T16_NAME = 'DR-Halal';
export const T16_DESC = 'Recipes that follow halal dietary guidelines.';
export const T17_NAME = 'MT-Breakfast';
export const T17_DESC = 'Meals commonly eaten for breakfast.';
export const T18_NAME = 'MT-Lunch';
export const T18_DESC = 'Meals commonly eaten for lunch.';
export const T19_NAME = 'MT-Dinner';
export const T19_DESC = 'Meals commonly eaten for dinner.';
export const T20_NAME = 'MT-Snacks';
export const T20_DESC = 'Small meals or snacks.';
export const T21_NAME = 'SL-Beginner';
export const T21_DESC = 'Recipes suitable for beginners.';
export const T22_NAME = 'SL-Intermediate';
export const T22_DESC = 'Recipes for those with moderate cooking skills.';
export const T23_NAME = 'SL-Advanced';
export const T23_DESC = 'Recipes for advanced cooks.';

export const C1_TEXT =
  'This explanation about React Router is really helpful! I never realized it was just a wrapper around history. Thanks!';
export const C2_TEXT =
  'I appreciate the detailed breakdown of how to use a single history object in React. It simplified my routing significantly.';
export const C3_TEXT =
  "Thank you for the suggestion on using apply() instead of commit. My app's performance has improved!";
export const C4_TEXT =
  'Your code snippet for saving data with YourPreference worked like a charm! I was struggling with SharedPreferences before.';
export const C5_TEXT =
  'I get what you mean by those examples being confusing. Your custom approach makes way more sense for my use case.';
export const C6_TEXT =
  'I had not considered using BLOBs for storing content in a database. This will work perfectly for my needs.';
export const C7_TEXT =
  'GridFS seems like a good option for chunking large files. I will give it a try for my media storage requirements.';
export const C8_TEXT =
  'SQLLite is such a versatile solution for local storage, especially for mobile applications. Thanks for the reminder!';
export const C9_TEXT =
  'The question about React Router really resonates with me, I faced the same challenge a few weeks ago.';
export const C10_TEXT =
  "The answer recommending GridFS was eye-opening. I've used it before but never thought of applying it in this scenario!";
export const C11_TEXT =
  'I found the discussion on SharedPreferences vs apply() very useful. Great explanation of the differences!';
export const C12_TEXT =
  'I feel like there is so much more to Android Studio that I am just scratching the surface of. Thanks for sharing your experience!';
export const C13_TEXT =
  'This tip on balancing flavors is so useful! I never knew acidity could counteract too much sweetness. Thanks!';
export const C14_TEXT =
  'I appreciate the suggestion to use cornstarch as a thickener. It worked perfectly for my homemade sauce!';
export const C15_TEXT =
  'The trick about storing fresh herbs in a damp paper towel is a game changer. My herbs last so much longer now!';
export const C16_TEXT =
  'Your explanation of umami was really insightful! Now I understand why mushrooms and soy sauce make dishes taste so rich.';
export const C17_TEXT =
  'I always struggled with meal prep, but your breakdown makes it seem so much easier. Definitely giving it a try!';
export const C18_TEXT =
  "I hadn't thought of using fermentation for food preservation. This is really helpful for making homemade kimchi!";
export const C19_TEXT =
  'The idea of substituting eggs with flaxseed in baking is brilliant! It kept my muffins moist without changing the taste.';
export const C20_TEXT =
  'I was skeptical about freezing fresh pasta, but your suggestion worked great. It cooked perfectly!';
export const C21_TEXT =
  'I love how simple your knife skills guide is. My chopping has gotten so much more precise thanks to this!';
export const C22_TEXT =
  'I have been over-salting my soups for years—your tip about adding a bit of sugar really helped fix the flavor.';
export const C23_TEXT =
  'I never realized letting dough rest could make such a difference in texture. Thanks for the baking advice!';
export const C24_TEXT =
  'This discussion on spices is fascinating. I did not know cumin and coriander paired so well together!';
