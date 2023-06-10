# Test Taking Website

This is a simple test taking website that uses sessions to save results. 

## Results

Take all the tests and see the secret Result screen.

## How to run code locally

1.  Refer to the [appengine/README.md][readme] file for instructions on
    running and deploying.
1.  Install dependencies:

        npm install

## Running locally

    node app.js


### notes on heroku deployment
open terminal to see logs
$ heroku logs --tail
H14 error in heroku - "no web processes running"
$ heroku ps:scale web=1
the above activates web dynos, and incurs a cost...
to put it back
$ heroku ps:scale web=0