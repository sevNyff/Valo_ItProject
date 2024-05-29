package E2ETest;

import com.microsoft.playwright.*;

public class loginTest {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false)); // Set headless to false for UI visibility
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("http://localhost:8080/Valo_Login/login.html"); // Navigate to the login page

            // Fill the username and password fields
            page.fill("#username", "test");
            page.fill("#password", "test");

            // Click the login button and wait for navigation
            page.waitForNavigation(() -> {
                page.click("#button-login");
            });


            boolean loginSuccessful = page.isVisible("#loginRegisterButton") &&
                    "Logout".equals(page.textContent("#loginRegisterButton"));

            if (loginSuccessful) {
                System.out.println("Login was successful!");
            } else {
                System.out.println("Login failed.");
            }

            // Close the browser
            context.close();
            browser.close();
        } catch (PlaywrightException e) {
            e.printStackTrace();
        }
    }
}
