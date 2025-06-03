# SpriteCloud Assessment

This repo is used to house my submission for the spriteCloud assessment. Please feel free to clone the repo and try out the tests locally, or run the integrated pipeline and view the results from there!

## How to run the tests locally

1. Ensure you have playwright[https://playwright.dev/] installed
2. Clone this repo
3. Navigate to the location you cloned to
4. Run 'npx playwright test`

## Running the tests on Github

1. Navigate to https://github.com/ColonelCrackpot/spriteCloudAssessment/actions/workflows/main.yml
2. Select run workflow
3. Wait for the tests to run and the report to generate
4. The latest report can be found here - https://colonelcrackpot.github.io/spriteCloudAssessment/

## Coverage

The tests included cover the below scenarios

### saucedemo.com

1. Write a full checkout that contains, at least, two items. Validate the final price.
    1. I have implemented a method that allows test data to be passed through in the form of item names. This allows us to pass through any number of items. All items prices are added to a list and compared with the total price in the checkout page before completing the checkout process.
2. Write a test that sorts the items by name Z-A and validate that the sorting is correct.
    1. Similar to the above, I have created a method that allows any shortCode to be passed through for the filter box, however since checking the order of the list is only limited to Z-A, I did not implemented a more detailed approach that would actually alter the control list for any scenario.
3. Write a validation for a failed log in.
    1. This is a fairly simple test case. To add more to it I added test data in the form of different login inputs, along with the expected output, so adding more in the future will be a breeze.

### regres.in

1. Retrieve a list of users
2. Perform a successful login
3. Perform an update
4. Perform a deletion
5. Execute 2 negative scenarios of your choice
    1. I chose two fairly simple examples, a failed login request along with an invalid user request
6. Execute a parameterized delayed request (max 3 seconds) and evaluate how long the request takes.
    1. Similar to the UI tests I created test data to be passed through to allow different delays