const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

const itemData = new Map();

const loadItemData = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('[DEBUG] Starting to load item_material_base.csv');
            // Load Consumable Items (item_material_base.csv)
            fs.createReadStream(path.join(__dirname, '../../ref/ref_meta_data/csv/item_material_base.csv'))
                .pipe(iconv.decodeStream('euc-kr')) // Decode from euc-kr
                .pipe(csv({ skipLines: 4, headers: false })) // Skip first 4 lines to exclude the header row
                .on('data', (row) => {
                    // Manually assign columns based on inspection from debug logs (using numeric indices)
                    const id = row[1]; 
                    const name_kor = row[4]; 
                    const description_kor = row[5]; 
                    const item_category = row[7]; 

                    // console.log('[DEBUG - Material Item Raw]:', row);
                    // console.log('[DEBUG - Material Item Extracted]:', { id, name_kor, description_kor, item_category });

                    if (id && name_kor) {
                        itemData.set(id, {
                            id: id,
                            name_kor: name_kor,
                            name: name_kor, 
                            type: 'consumable',
                            description: description_kor,
                            category: item_category
                        });
                        // console.log('[DEBUG] Added consumable item:', id, name_kor);
                    } else {
                        console.log('[DEBUG] Skipped consumable row (missing id or name_kor):', row);
                    }
                })
                .on('end', () => {
                    console.log('Consumable items loaded. Total:', itemData.size);

                    console.log('[DEBUG] Starting to load item_equip_base.csv');
                    // Load Equipment Items (item_equip_base.csv)
                    fs.createReadStream(path.join(__dirname, '../../ref/ref_meta_data/csv/item_equip_base.csv'))
                        .pipe(iconv.decodeStream('euc-kr')) // Decode from euc-kr
                        .pipe(csv({ skipLines: 4, headers: false })) // Skip first 4 lines to exclude the header row
                        .on('data', (row) => {
                            // Manually assign columns based on inspection from debug logs (using numeric indices)
                            const id = row[1]; 
                            const name_kor = row[8]; 
                            const description_kor = row[7]; 
                            const item_category = row[4]; 

                            // console.log('[DEBUG - Equip Item Raw]:', row);
                            // console.log('[DEBUG - Equip Item Extracted]:', { id, name_kor, description_kor, item_category });

                            if (id && name_kor) {
                                itemData.set(id, { 
                                    id: id,
                                    name_kor: name_kor,
                                    name: name_kor,
                                    type: 'equipment', 
                                    description: description_kor,
                                    category: item_category
                                });
                                // console.log('[DEBUG] Added equipment item:', id, name_kor);
                            } else {
                                // console.log('[DEBUG] Skipped equipment row (missing id or name_kor):', row);
                            }
                        })
                        .on('end', () => {
                            console.log('Equipment items loaded. Total:', itemData.size);
                            resolve(itemData);
                        });
                });
        } catch (error) {
            console.error('Error loading item data:', error);
            reject(error);
        }
    });
};

const getItemData = () => itemData;

module.exports = { loadItemData, getItemData };
