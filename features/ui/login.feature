# ============================================
# LOGIN PAGE TEST - Playwright MCP
# ============================================
#
# This feature tests the login functionality
# with MCP (Model Context Protocol) integration
# for AI-powered test analysis
@login @ui @mcp
Feature: User Login
  As a user
  I want to login to the application
  So I can access my account

  Background:
    Given I navigate to the login page

  @smoke @critical
  Scenario: Successful login with valid credentials
    # Step 1: Username and language
    When I enter valid username
    And I select valid language
    And I click Continue
    # Step 2: Password (after Continue)
    When I enter valid password
    And I click Sign in
    Then I should be logged in successfully
    And I should see the dashboard

  @negative
  Scenario: Failed login with invalid credentials
    # Step 1: Username and language
    When I enter invalid username
    And I select valid language
    And I click Continue
    # Step 2: Password (after Continue)
    When I enter invalid password
    And I click Sign in
    Then I should not be logged in
    And I should still be on the login page

  @validation
  Scenario: Login validation - empty username
    When I leave username empty
    And I select valid language
    And I click Continue
    Then I should see a validation error for username

  @validation
  Scenario: Login validation - empty password
    # Step 1: Username and language
    When I enter valid username
    And I select valid language
    And I click Continue
    # Step 2: Password (leave empty)
    When I leave password empty
    And I click Sign in
    Then I should see a validation error for password

  # ============================================
  # FORGOT PASSWORD SCENARIOS
  # ============================================

  @forgot-password @smoke
  Scenario: Access forgot password page from login
    When I enter valid username
    And I select valid language
    And I click Continue
    When I click on forgot password link
    Then I should be on the forgot password page
    And email field should be pre-filled

  @forgot-password @critical
  Scenario: Successfully submit password reset request
    When I enter valid username
    And I select valid language
    And I click Continue
    When I click on forgot password link
    And I enter a valid email address
    And I click send reset link
    Then I should see success message containing "5 minuten"
    And I should see success message containing "24 uur geldig"
