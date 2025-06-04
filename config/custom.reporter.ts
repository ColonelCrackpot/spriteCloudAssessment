import { Reporter, TestCase, Suite } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
    private getProjectName(test: TestCase): string {
        let currentSuite: Suite | undefined = test.parent;
        while (currentSuite) {
            if (currentSuite.project()) {
                return currentSuite.project()!.name;
            }
            currentSuite = currentSuite.parent;
        }
        return 'unknown_project';
    }

    onTestBegin(test: TestCase) {
        const projectName = this.getProjectName(test);
        const browserTag = `[${projectName.trim()}]`;

        if (test.parent && test.parent.title) {
            if (!test.parent.title.endsWith(browserTag)) {
                test.parent.title = `${test.parent.title} ${browserTag}`;
            }
        }

        if (!test.title.endsWith(browserTag)) {
            test.title = `${test.title} ${browserTag}`;
        }
    }
}

export default CustomReporter;