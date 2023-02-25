# The-Art-Journey

## Project idea
The idea of project is to build a web app that gives the art lovers to explore arts and keep all of their favorite art pieces in one place.

## User stories
As a art lovers, the users can explore and vote art pieces. However, users have to sign up and log in to save, add new one or delete their own collection.

## Links to the project site
[https://the-art-journey.herokuapp.com/]

## Technologies
Project is built with:
- Node;
- Express;
- MongoDB;

## Building
Two models: 
- Art model for public collection;
- User is a model with subdocument which is user's collection.
Controllers:
- Arts controller has differents routes that allow general users to view, vote for art, and allow authenticated users to add an art to their collection.
- Users controller has all 7 RESTful routes.
- Sessions controller is used for authentication
Views:
- A homepage;
- Views for public users;
- Views for authenticated users;
