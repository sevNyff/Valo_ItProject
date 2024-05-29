package E2ETest;

import com.microsoft.playwright.*;

public class trucksTest {
    public static void main(String[] args) {
        Playwright playwright = Playwright.create();
        Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false)); // Set headless to false for UI visibility
        BrowserContext context = browser.newContext();
        Page page = context.newPage();

        // Step 1: Login
        page.navigate("http://localhost:8080/Valo_Login/login.html"); // Navigate to the login page
        page.fill("#username", "test");
        page.fill("#password", "test");
        page.waitForNavigation(() -> {
            page.click("#button-login"); // Click the login button
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

        // Step 2: Navigate to the trucks page
        page.navigate("http://localhost:8080/Valo_Trucks/trucks.html");
        page.waitForSelector("#trucksContainer");

        // Step 3: Add 10 trucks
        for (int i = 1; i <= 10; i++) {
            // Navigate to the add truck page
            page.navigate("http://localhost:8080/Valo_Trucks/addTruck.html");

            // Fill in the truck details
            String brandName = "Brand " + i;
            String capacity = String.valueOf(1000 + i * 100);

            page.fill("#brand", brandName);
            page.fill("#capacity", capacity);

            page.waitForNavigation(() -> {
                page.click("#button-newTruck");
            });
        }

        System.out.println("Successfully added 10 trucks.");

        // Do not close the browser
        // context.close();
        // browser.close();
    }
}
