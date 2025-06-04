import { Reporter, TestCase } from '@playwright/test/reporter';

    class CustomReporter implements Reporter {
        // Add browser name to test suite junit report
        // this is needed to differentiate between same test file that runs on different browsers in the junit
        onTestBegin(test: TestCase) {
            const browserName = `[${test.parent.parent!.title}]`
    
            // change test suite name (for junit): test-folder/example.spec.ts [firefox]
            test.parent.title = `${browserName} ${test.parent.title}`
    
            // change test case name: has title [firefox]
            // test.title += ` ${browserName}`
        }
    }
export default CustomReporter;