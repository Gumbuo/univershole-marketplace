# Downloads Folder

This folder contains the ZIP files for purchased characters.

## Setup Instructions:

1. Place your character ZIP files in this folder
2. Name them exactly matching the product IDs in the marketplace

## File Naming:

The ZIP files should be named exactly as the `productId` in your products array.

For example:
- `yellow-ghost-specter.zip`
- `orange-ghost-specter.zip`
- `combat-robot.zip`
- etc.

## Important:

- This folder is NOT publicly accessible
- Files are only served through the `/api/download` endpoint
- Download requires verified purchase (wallet must have paid for the item)
