# Classic Store Backend Skeleton

- Java: 21
- Spring Boot: 3.4.2
- Build: `./mvnw -B verify`

This task intentionally contains no persistence layer, JPA, Flyway, or database driver.
The correlation filter is installed inside the Spring Security chain so trace IDs are available for authentication failures as well as controller responses.
