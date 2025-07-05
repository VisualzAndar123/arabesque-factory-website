const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

async function buildProductData() {
    const contentDir = path.join(__dirname, 'content');
    const saleDir = path.join(contentDir, 'products-for-sale');
    const rentDir = path.join(contentDir, 'products-for-rent');
    
    const allSaleProducts = [];
    const allRentProducts = [];

    // Process Products for Sale
    if (await fs.pathExists(saleDir)) {
        const saleFiles = await fs.readdir(saleDir);
        for (const file of saleFiles) {
            const rawContent = await fs.readFile(path.join(saleDir, file), 'utf-8');
            const { data } = matter(rawContent);
            allSaleProducts.push({ id: path.basename(file, '.md'), ...data });
        }
    }

    // Process Products for Rent
    if (await fs.pathExists(rentDir)) {
        const rentFiles = await fs.readdir(rentDir);
        for (const file of rentFiles) {
            const rawContent = await fs.readFile(path.join(rentDir, file), 'utf-8');
            const { data } = matter(rawContent);
            allRentProducts.push({ id: path.basename(file, '.md'), ...data });
        }
    }

    const output = {
        sale: allSaleProducts,
        rent: allRentProducts
    };

    // Ensure the output directory exists
    const outputDir = path.join(__dirname, 'dist');
    await fs.ensureDir(outputDir);
    
    // Write the combined data to a JSON file in the output directory
    await fs.writeFile(path.join(outputDir, 'products.json'), JSON.stringify(output, null, 2));

    console.log('Product data built successfully!');
}

buildProductData().catch(error => {
    console.error('Error building product data:', error);
    process.exit(1);
});