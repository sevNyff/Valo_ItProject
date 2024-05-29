package E2ETest;

import com.microsoft.playwright.*;

public class customerTest {
    public static void main(String[] args) {
        Playwright playwright = Playwright.create();
        Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false)); // Set headless to false for UI visibility
        BrowserContext context = browser.newContext();
        Page page = context.newPage();

        // Step 1: Login
        page.navigate("http://localhost:8080/Valo_Login/login.html");
        page.fill("#username", "test");
        page.fill("#password", "test");
        page.waitForNavigation(() -> {
            page.click("#button-login");
        });

        // Check for a successful login
        boolean loginSuccessful = page.isVisible("#loginRegisterButton") &&
                "Logout".equals(page.textContent("#loginRegisterButton"));
        if (loginSuccessful) {
            System.out.println("Login was successful!");
        } else {
            System.out.println("Login failed.");
            return;
        }

        // Step 2: Navigate to the customers page
        page.navigate("http://localhost:8080/Valo_Customer/customers.html");
        page.waitForSelector("#customersContainer");

        // Step 3: Add 10 customers
        for (int i = 1; i <= 10; i++) {
            // Navigate to the add customer page
            page.navigate("http://localhost:8080/Valo_Customer/addCustomer.html");

            // Fill in the customer details
            String customerName = "Customer " + i;
            String customerAddress = "Address " + i;
            String customerCity = "City " + i;

            page.fill("#name", customerName);
            page.fill("#address", customerAddress);
            page.fill("#city", customerCity);

            page.waitForNavigation(() -> {
                page.click("#button-newCustomer");
            });
        }

        System.out.println("Successfully added 10 customers.");

        // Do not close the browser
        // context.close();
        // browser.close();
    }
}
