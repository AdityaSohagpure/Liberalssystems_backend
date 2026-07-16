# Scratchpad

## Findings & Actions Taken

1. **Browser Failure Analysis**:
   - Bypassed the browser path due to a Playwright installation error. Managed the database schema directly using the local MySQL CLI.

2. **Database Migration to MySQL**:
   - Located the MySQL server on port `3306`.
   - Created the missing databases (`user_db`, `catalog_db`, `payment_db`, `custom_db`, `order_db`).
   - Migrated all remaining Prisma database schemas to `provider = "mysql"`.
   - Generated client code (`npm run prisma:generate`) and pushed schemas to MySQL (`npm run prisma:push`).

3. **Workspace Migration to D Drive**:
   - The user freed up disk space by moving the entire workspace `Liberal` from `C:\Users\HP\OneDrive\onedrivefol\OneDrive\Desktop\Liberal` to `D:\Liberal` (268 GB free).
   - Acquired permissions for file access on the `D:\` drive.

4. **API Gateway Path Resolution**:
   - Fixed path forwarding behavior in the gateway (`gateway/src/index.ts`) using express-specific path prefix prepending.
   - Added specific proxying rules for `/api/cart` and `/api/products/:id/availability` to target the correct services.

5. **Wishlist-to-Cart (Like-to-Cart) Endpoint**:
   - Implemented `POST /orders/cart/from-wishlist` in the Order Service.
   - Retrieves the wishlist from the User Service, validates, moves the item to the cart, and removes it from the user's wishlist in a multi-service flow.

6. **Endpoint Alignments & Verification**:
   - Aligned cart routes and availability checks in the Order Service to conform to the API specification.
   - Successfully spun up all microservices and ran integration tests in `scratch/verify_endpoints.js` and `scratch/verify_liketocart.js`. All verification checks passed (endpoints return correctly, double-booking is prevented, like-to-cart transfers seamlessly).
