import TestRailReporter from "../../cucumber-testrail-reporter/cucumber-testrail-reporter"
import { constants } from "./constants"
export default new TestRailReporter({
  jsonLocation: "./testRail.json",
  isTestRailRun: constants.isTestRailRun,
  testRailConfig: {
    domain: "",
    username: "",
    password: "",
    projectId: 0,
    suiteId: 0,
    // runName: "My test run",
    includeAll: true,
    // runId: 2,
  }
})