const fs = require('fs');
const readline = require('readline');

function cleanString(input) {
    // Normalize diacritics and remove combining marks
    const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
    // Remove all characters except lowercase letters, numbers, underscores, and spaces
    return normalized.replace(/[^a-z0-9_ ]/gi, '').toLowerCase();
  }

async function csvToJson(inputFilePath, outputFilePath, firstProduct, maxObjects, targetLocales) {
    try {
        const jsonString = fs.readFileSync('p2cat.json', 'utf8');

        // Parse the JSON string into an object
        const data = JSON.parse(jsonString);

        // Convert the JSON array to a Set
        const p2cat = new Map(data.map(item => [item.id, item.values]));

        // Parse the JSON string into an object
        const p2cat_labels_en_data = JSON.parse(fs.readFileSync('p2cat_labels_en.json', 'utf8'));
        const p2cat_labels = new Map(p2cat_labels_en_data.map(item => [item.id, item.values]));

        const p2gender_data = JSON.parse(fs.readFileSync('p2gender.json', 'utf8'));
        const p2gender = new Map(p2gender_data.map(item => [item.id, item.values]));
        const p2group_data = JSON.parse(fs.readFileSync('p2group.json', 'utf8'));
        const p2group = new Map(p2group_data.map(item => [item.id, item.values]));



        const fileStream = fs.createReadStream(inputFilePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity // Handles all line breaks
        });

        let result = [];
        let headers = [];
        let currentVariant = null; // Current object being built
        let lastVariantId = null; // Last processed `variant_id`
        let product_count = 0;
        let batch_number = 1;
        const localeSuffixes = targetLocales.map((locale) => locale.split('_')[1].toLowerCase()); // Extract suffixes (e.g., "de")
        const suffixRegex = new RegExp(`_(${localeSuffixes.join('|')})$`, 'i'); // Regex to match valid suffixes (e.g., _de, _us)

        let count = 0

        for await (const line of rl) {
            // console.log("Loop: ", count)
            count++

            // Skip empty lines
            if (line.trim() === '') continue;

            // Handle headers
            if (headers.length === 0) {
                headers = line.split('\t').map((header) => header.trim());
                continue;
            }
            if (count < 99) {
                continue;
            }
            // Split line into columns
            const columns = line.split('\t').map((col) => col.trim());
            const row = headers.reduce((acc, header, idx) => {
                acc[header] = columns[idx] || '';
                return acc;
            }, {});

            const { variant_id, locale } = row;
            let { attribute_id, attribute_value } = row;
            // Skip rows without a valid `variant_id` or `attribute_id`
            if (!variant_id || !attribute_id) continue;

            // If this row is for a new `variant_id`
            if (variant_id !== lastVariantId) {
                console.log("done with on eproduct",variant_id)

                // Finalize the current variant and push it to the result array
                product_count = product_count +1;
                console.log("product count: ", product_count);
                if ((currentVariant) && ("sku" in currentVariant)) {
                    console.log("product sku: ", currentVariant["sku"]);
                    const group = p2group.get(currentVariant["sku"]);
                    if (group) {
                        currentVariant["groups"] = group
                    }
                    const gender = p2gender.get(currentVariant["sku"]);
                    if (gender) {
                        currentVariant["gender"] = gender
                    }
                    const cat = p2cat.get(currentVariant["sku"]);
                    if (cat) {
                        currentVariant["categories"] = cat
                    }

                    const cat_label = p2cat_labels.get(currentVariant["sku"]);
                    if (cat_label) {
                        currentVariant["ec_category"] = cat_label
                    }
                }
                if (currentVariant && product_count > firstProduct) {
                    result.push(currentVariant);
                }

                // Stop processing if we have enough objects
               // if (result.length >= maxObjects) break;

                // Start a new object for this `variant_id`
                currentVariant = { variant_id };
                lastVariantId = variant_id;
            }

            // Determine if the attribute should be included
            const hasLocaleSuffix = suffixRegex.test(attribute_id); // Matches valid suffix
            const isGlobalAttribute = !locale && !hasLocaleSuffix; // No locale and no suffix
            const isMatchingLocale = locale && targetLocales.includes(locale); // Matches target locale
            const isSuffixMatch = !locale && hasLocaleSuffix; // Suffix matches without explicit locale
            const hasAnyLocaleSuffix = /_[a-zA-Z]{2}$/.test(attribute_id)

            // Skip if the attribute_id has a country suffix but does not match the target
            if (!hasLocaleSuffix && hasAnyLocaleSuffix) {
                continue;
            }

            if (!(isGlobalAttribute || isMatchingLocale || isSuffixMatch)) {
                continue; // Skip attributes that don't meet criteria
            }

            if (isMatchingLocale || isSuffixMatch) {
                attribute_id = attribute_id.replace(`_${localeSuffixes}`, "")
            }
            // Add attributes to the current variant
            if (attribute_id && currentVariant) {
                // Properly format some attribute values
                if (attribute_value == "false=false") {
                    attribute_value = "false"
                }
                if (attribute_value == "true=true") {
                    attribute_value = "true"
                }
                if (attribute_id === "_thumburl") {
                    currentVariant["thumburl"] = attribute_value || null;
                } else if (attribute_id === "display_only" || attribute_id === "available_online" || attribute_id === "has_stock" || attribute_id == "is_sellable" || attribute_id == "is_searchable" || attribute_id == "is_visible") {
                    let country = localeSuffixes[0]+"="+localeSuffixes[0]
                    if (attribute_value.toLowerCase().includes(country)) {
                        attribute_value = "true"
                    } else {
                        attribute_value = false;
                    }
                    currentVariant[attribute_id]=attribute_value
                } else if (attribute_id == "dimensions_imp" || attribute_id == "dimensions_int") {
                    if (attribute_value !== null || attribute_value !== '') {
                        // console.log(attribute_value)
                        let tidy_array = attribute_value.split('|').map((el) => el.trim());
                        let output = {};
                        tidy_array.forEach((el) => {
                            // console.log(el)
                            el_array = /:/.test(el) ? el.split(':') : el.split("from");
                            if (el_array.length == 1) {
                                // console.log(el_array)
                            } else {
                                attribute_dim_id = cleanString(el_array[0].trim().toLowerCase().replaceAll(' ', '_'))
                                if (attribute_dim_id.charAt(0) >= '0' && attribute_dim_id.charAt(0) <= '9') {
                                    attribute_dim_id = "x"+attribute_dim_id
                                }
                                output[attribute_dim_id] = el_array[1].trim();
                            }
                        });
                        currentVariant = {...currentVariant, ...output}
                    }
                } else {
                    currentVariant[attribute_id] = attribute_value || null;
                }
            }

            if (localeSuffixes == "us") {
                currentVariant["clickableuri"] = `https://www.hermes.com/us/en/product/${currentVariant["slug"]}-${currentVariant["sku"]}`
                currentVariant["language"] = "English"
            }
            if (localeSuffixes == "de") {
                currentVariant["clickableuri"] = `https://www.hermes.com/de/de/product/${currentVariant["slug"]}-${currentVariant["sku"]}`
                currentVariant["language"] = "German"
            }
            if (localeSuffixes == "fr") {
                currentVariant["clickableuri"] = `https://www.hermes.com/fr/fr/product/${currentVariant["slug"]}-${currentVariant["sku"]}`
                currentVariant["language"] = "French"
            }

            currentVariant["ec_name"] = currentVariant["title"] ? currentVariant["title"] : "N/A"
            currentVariant["ec_product_id"] = currentVariant["sku"] ? currentVariant["sku"] : "N/A"
            currentVariant["ec_productid"] = currentVariant["sku"] ? currentVariant["sku"] : "N/A"
            currentVariant["ec_price"] = currentVariant["price"] ? parseFloat(currentVariant["price"]) : "N/A"
            currentVariant["ec_description"] = currentVariant["description"] ? currentVariant["description"] : "N/A"
            currentVariant["ec_thumbnails"] = currentVariant["thumburl"] ? currentVariant["thumburl"] : "N/A"
            currentVariant["ec_images"] = currentVariant["thumburl"] ? currentVariant["thumburl"].split('?')[0] : "N/A"
            if (currentVariant["variation_parent_product"])
                currentVariant["ec_item_group_id"] = currentVariant["variation_parent_product"]
            currentVariant["documentId"] = `https://www.hermes.com/${currentVariant["sku"]}`.replaceAll(" ", "_")
            currentVariant["objecttype"] = "Product"
            // if(currentVariant["ec_name"] == "N/A") continue

            // Create structured product body for CRGA and semantic
            body = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${currentVariant["ec_name"]}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    section { margin-top: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
                    h2 { color: #555; }
                </style>
            </head>
            <body>

                <h1>${currentVariant["ec_name"]}</h1>

                <section id="product-name">
                    <h2>Product Name</h2>
                    <p>${currentVariant["ec_name"]}</p>
                </section>

                <section id="product-information">
                    <h2>Material</h2>
                    <p>${currentVariant["main_material"]}</p>
                    <h2>Colour</h2>
                    <p>${currentVariant["main_color_1"]} product</p>
                </section>

                <section id="product-description">
                    <h2>Description</h2>
                    <p>${currentVariant["description"]}</p>
                </section>

            </body>
            </html>
            `
            // Add body to currentVariant object
            currentVariant["body"] = body
            if (result.length >= maxObjects) {
                let filename = outputFilePath+"_"+target_locale +"_"+batch_number+".json";
                // Write the output to a JSON file
                fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
                console.log("filename:"+filename);
                batch_number = batch_number + 1;
                result = [];
            }
        }
        if (result.length > 0) {
            let filename = outputFilePath+"_"+target_locale +"_"+batch_number+".json";
            // Write the output to a JSON file
            fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
            console.log("filename:"+filename);
            batch_number = batch_number + 1;
            result = [];
        }
        // Finalize the last variant
        // if (currentVariant && result.length < maxObjects) {
        //     result.push(currentVariant);
        // }

        console.log(`JSON output saved to ${outputFilePath}`);
        console.log("Rows: ", count)
    } catch (err) {
        console.error('Error:', err);
    }
}


// const target_locale = 'de_DE'
const target_locale = 'en_US'
//const target_locale = 'fr_FR'

// Example usage
// Replace 'input-file.csv' with the path to your input file
// Replace 'output-file.json' with the path to your desired output file
// Set maxObjects to the number of variant_id objects to output
csvToJson('custom_variant_attributes.csv', 'output-file', 0, 10000, [target_locale]);
//csvToJson('output-file.csv', `output-file-${target_locale}.json`, 10000000, [target_locale]);
