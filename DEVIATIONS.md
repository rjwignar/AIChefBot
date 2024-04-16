## AIChefBot Deviations

### Deviations in Functional Requirements (read alongside Functional Requirements section In SRS)

#### Member User Login
2.1.6. Protect users by locking account after 5 failed login attempts (didn’t add)

#### Generate Recipes
- 3.1.1. Allow users to add ingredients by voice entry (didn't add)
- 3.1.5. System will generate three (3) recipes according to provided ingredients and dietary preferences. (Updated Implementation)
	We have 3 separate options to select different types of generating recipes based on by ingredients, by diet and ingredients and diet.

#### Manage Member Profile
- 4.1.1.1. Confirmation email will be sent to ensure that it's from a valid user (Updated Implementation)
	Users must put in their current email for the account when attempting to change, no confirmation email needed.

#### Manage Recipe Book
- 5.1.3.1. Upon requesting similar recipes: API will use the selected recipe as a baseline for 5 new recipes to be generated (Updated Implementation)
does 3 new recipes to follow the design of the rest of the website

#### Sharing a Recipe (Updated Implementation)
- 6.1.1. The saved recipes will have a button to share it. 
Has the option to save/download the recipe as a pdf.
- 6.1.2. System will prompt user to select how to share recipe.
Once the pdf is downloaded to the device the user can share it however, they want
- 6.1.3. System will prompt user to select recipient(s) (Not added)
- 6.1.3.1. Sharing gives a URL that you can give to another user.
	Same point as 6.1.3. just not needed with the pdf implementation

### Deviations in Nonfunctional Requirements (read alongside Nonfunctional Requirements section in SRS)

#### Cultural and Political:
- The content and user interfaces will allow multiple languages to cater to a diverse user base (different implementation)
- The user interface is currently in English only. However, if the user enters ingredients in another language, generated recipes will sometimes have ingredient in that language. Example below:


#### Testing:
- Thorough unit testing and integration testing to ensure smooth deployment
- Unit testing and integration testing was not added
Feedback:
- Integrate a mechanism to collect user feedback on issues/concerns with our web app (different implementation)

The Issues Section of the AIChefbot GitHub Repository will be used to provide feedback on issues, report bugs, and suggest new features

### Features in Final Project not described in original SRS
- Saving diet preferences.
- Cache recipes for users who refresh, leave the page, to make an account to save the recipe etc.
- Adding dates to recipes. 
- Added AI image generating to generated recipes and saving those pictures to Cloudinary.
