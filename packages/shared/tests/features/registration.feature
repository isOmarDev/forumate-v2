Feature: Registration
  As a new user,
  I want to register as a Member
  So that I can vote on posts, ask questions, and earn points for discounts.

  @frontend
  Scenario: Successful registration with marketing emails accepted
    Given I am a new user
    When I register with valid account details accepting marketing emails
    Then I should be granted access to my account
    And I should expect to receive marketing emails
  # Success scenarios

  @backend
  Scenario: Successful registration without marketing emails accepted
    Given I am a new user
    When I register with valid account details declining marketing emails
    Then I should be granted access to my account
    And I should not expect to receive marketing emails
  # Failure scenarios

  @backend @frontend
  Scenario: Invalid or missing registration details
    Given I am a new user
    When I register with invalid account details
    Then I should see an error notifying me that my input is invalid
    And I should not have been sent access to account details

  @backend @frontend
  Scenario: Account already created with email
    Given a set of users already created accounts
      | firstName | lastName | email             | password    |
      | John      | Doe      | john@example.com  | Sugerland1! |
      | Alice     | Smith    | alice@example.com | Sugerland1! |
      | David     | Brown    | david@example.com | Sugerland1! |
    When new users attempt to register with those emails
      | firstName | lastName | username       | email             | password    |
      | Bill      | Bob      | the_chosenone1 | john@example.com  | Sugerland1! |
      | Max       | Samson   | !chillblinton2 | alice@example.com | Sugerland1! |
      | Will      | Steff    | greenday@3     | david@example.com | Sugerland1! |
    Then they should see an error notifying them that the account already exists
    And they should not have been sent access to account details

  @backend
  Scenario: Username already taken
    Given a set of users have already created their accounts with valid details
      | firstName | lastName | username     | email              | password    |
      | John      | Doe      | thechosenone | john1@example.com  | Sugerland1! |
      | Alice     | Smith    | chillblinton | alice2@example.com | Sugerland1! |
      | David     | Brown    | greenday     | david3@example.com | Sugerland1! |
    When new users attempt to register with already taken usernames
      | firstName | lastName | username     | email                 | password    |
      | Bill      | Bob      | thechosenone | billy@billbob.com     | Sugerland1! |
      | Max       | Samson   | chillblinton | maxsamson@example.com | Sugerland1! |
      | Will      | Steff    | greenday     | willsteff@example.com | Sugerland1! |
    Then they see an error notifying them that the username has already been taken
    And they should not have been sent access to account details
