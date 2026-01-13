// Unit tests for RSS Feed functionality
// Import test framework (in browser environment, these would be script tags)

async function runRSSFeedTests() {
    const runner = new TestRunner();
    
    // Test RSS Feed Manager initialization
    runner.test('RSSFeedManager should initialize with correct URL', () => {
        const rssManager = new RSSFeedManager();
        runner.assertEqual(rssManager.rssUrl, 'https://distrowatch.com/news/dw.xml');
        runner.assert(rssManager.proxyUrl.includes('api.allorigins.win'));
    });

    // Test item parsing with valid data
    runner.test('Should parse RSS items correctly', () => {
        const rssManager = new RSSFeedManager();
        
        // Mock DOM elements
        const mockItems = [
            {
                querySelector: (selector) => {
                    const mockData = {
                        'title': { textContent: 'Test Title 1' },
                        'link': { textContent: 'https://example.com/1' },
                        'description': { textContent: 'Test description 1 with some content' },
                        'pubDate': { textContent: 'Mon, 13 Jan 2025 12:00:00 GMT' }
                    };
                    return mockData[selector] || { textContent: '' };
                }
            },
            {
                querySelector: (selector) => {
                    const mockData = {
                        'title': { textContent: 'Test Title 2' },
                        'link': { textContent: 'https://example.com/2' },
                        'description': { textContent: 'Test description 2 with different content' },
                        'pubDate': { textContent: 'Tue, 14 Jan 2025 12:00:00 GMT' }
                    };
                    return mockData[selector] || { textContent: '' };
                }
            }
        ];

        const items = rssManager.parseItems(mockItems);
        
        runner.assertEqual(items.length, 2);
        runner.assertEqual(items[0].title, 'Test Title 1');
        runner.assertEqual(items[0].link, 'https://example.com/1');
        runner.assert(items[0].description.includes('Test description 1'));
        runner.assert(items[0].pubDate.includes('2025'));
    });

    // Test item parsing with missing data
    runner.test('Should handle missing RSS item data gracefully', () => {
        const rssManager = new RSSFeedManager();
        
        const mockItems = [
            {
                querySelector: (selector) => {
                    const mockData = {
                        'title': { textContent: 'Only Title' }
                        // Missing link, description, pubDate
                    };
                    return mockData[selector] || { textContent: '' };
                }
            }
        ];

        const items = rssManager.parseItems(mockItems);
        
        runner.assertEqual(items.length, 1);
        runner.assertEqual(items[0].title, 'Only Title');
        runner.assertEqual(items[0].link, '#');
        runner.assertEqual(items[0].description, '...');
        runner.assertEqual(items[0].pubDate, 'Invalid Date');
    });

    // Test HTML generation
    runner.test('Should generate correct HTML from RSS items', () => {
        const rssManager = new RSSFeedManager();
        
        const mockItems = [
            {
                title: 'Test Title',
                link: 'https://example.com',
                description: 'Test description...',
                pubDate: '1/13/2025'
            }
        ];

        const html = rssManager.generateHTML(mockItems);
        
        runner.assertContains(html, 'Test Title');
        runner.assertContains(html, 'https://example.com');
        runner.assertContains(html, 'Test description...');
        runner.assertContains(html, '1/13/2025');
        runner.assertContains(html, 'rss-item');
    });

    // Test HTML generation with empty items
    runner.test('Should generate error message for empty RSS items', () => {
        const rssManager = new RSSFeedManager();
        const html = rssManager.generateHTML([]);
        
        runner.assertContains(html, 'error');
        runner.assertContains(html, 'No RSS items found');
    });

    // Test item limit (5 items max)
    runner.test('Should limit RSS items to 5 maximum', () => {
        const rssManager = new RSSFeedManager();
        
        const mockItems = Array(10).fill(null).map((_, index) => ({
            querySelector: (selector) => ({
                textContent: `Item ${index + 1}`
            })
        }));

        const items = rssManager.parseItems(mockItems);
        runner.assertEqual(items.length, 5);
    });

    // Test description truncation
    runner.test('Should truncate descriptions to 200 characters', () => {
        const rssManager = new RSSFeedManager();
        
        const longDescription = 'a'.repeat(300);
        const mockItems = [
            {
                querySelector: (selector) => ({
                    textContent: selector === 'description' ? longDescription : 'Test'
                })
            }
        ];

        const items = rssManager.parseItems(mockItems);
        runner.assert(items[0].description.length <= 203); // 200 + '...'
        runner.assert(items[0].description.endsWith('...'));
    });

    // Test successful RSS fetch
    runner.test('Should fetch RSS data successfully', async () => {
        const rssManager = new RSSFeedManager();
        
        const mockResponse = {
            contents: `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <item>
                        <title>Test News</title>
                        <link>https://example.com/news</link>
                        <description>Test news description</description>
                        <pubDate>Mon, 13 Jan 2025 12:00:00 GMT</pubDate>
                    </item>
                </channel>
            </rss>`
        };

        const mockFetch = new MockFetch(mockResponse);
        const items = await rssManager.fetchRSS(mockFetch.fetch.bind(mockFetch));
        
        runner.assert(items.length > 0);
        runner.assertEqual(items[0].title, 'Test News');
    });

    // Test RSS fetch failure
    runner.test('Should handle RSS fetch failure gracefully', async () => {
        const rssManager = new RSSFeedManager();
        
        const mockFetch = new MockFetch({}, true);
        
        try {
            await rssManager.fetchRSS(mockFetch.fetch.bind(mockFetch));
            runner.assert(false, 'Should have thrown an error');
        } catch (error) {
            runner.assert(error.message.includes('Network error'));
        }
    });

    // Test date formatting
    runner.test('Should format dates correctly', () => {
        const rssManager = new RSSFeedManager();
        
        const mockItems = [
            {
                querySelector: (selector) => ({
                    textContent: 'Mon, 13 Jan 2025 12:00:00 GMT'
                })
            }
        ];

        const items = rssManager.parseItems(mockItems);
        runner.assert(items[0].pubDate.includes('2025'));
        runner.assert(items[0].pubDate.includes('1'));
        runner.assert(items[0].pubDate.includes('13'));
    });

    // Test CSS styling verification
    runner.test('Should verify correct CSS styling for RSS feed', () => {
        const rssManager = new RSSFeedManager();
        const styles = rssManager.verifyStyling();
        
        // Test RSS section styling
        runner.assertEqual(styles.rssSection.background, 'white');
        runner.assertEqual(styles.rssSection.color, '#333');
        
        // Test RSS item styling
        runner.assertEqual(styles.rssItem.background, '#f8f9fa');
        runner.assertContains(styles.rssItem.borderLeft, '#7cc9d1');
        
        // Test RSS link styling
        runner.assertEqual(styles.rssLink.color, '#0066cc');
    });

    // Test HTML generation includes proper CSS classes
    runner.test('Should generate HTML with correct CSS classes for white background', () => {
        const rssManager = new RSSFeedManager();
        
        const mockItems = [
            {
                title: 'Test Title',
                link: 'https://example.com',
                description: 'Test description...',
                pubDate: '1/13/2025'
            }
        ];

        const html = rssManager.generateHTML(mockItems);
        
        // Verify CSS classes are present
        runner.assertContains(html, 'class="rss-item"');
        runner.assertContains(html, 'class="rss-date"');
        runner.assertContains(html, 'class="rss-description"');
        
        // Verify structure supports white background styling
        runner.assertContains(html, '<h3><a href='); // Link structure
        runner.assertContains(html, 'target="_blank"'); // External link
    });

    return await runner.run();
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runRSSFeedTests, TestRunner, RSSFeedManager, MockFetch };
}