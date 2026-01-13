// Simple test framework for KotiX-OS RSS functionality
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('Running tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                this.passed++;
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`✗ ${test.name}`);
                console.log(`  Error: ${error.message}\n`);
            }
        }

        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertContains(text, substring, message) {
        if (!text.includes(substring)) {
            throw new Error(message || `Expected "${text}" to contain "${substring}"`);
        }
    }
}

// Mock DOM elements for testing
class MockDOM {
    constructor() {
        this.elements = new Map();
    }

    createElement(tag) {
        return {
            innerHTML: '',
            textContent: '',
            style: {},
            classList: {
                add: () => {},
                remove: () => {}
            },
            querySelector: (selector) => this.querySelector(selector),
            querySelectorAll: (selector) => this.querySelectorAll(selector)
        };
    }

    getElementById(id) {
        return this.elements.get(id) || this.createElement('div');
    }

    querySelector(selector) {
        return this.createElement('div');
    }

    querySelectorAll(selector) {
        return [];
    }

    setElement(id, element) {
        this.elements.set(id, element);
    }
}

// Mock fetch for testing
class MockFetch {
    constructor(responseData, shouldFail = false) {
        this.responseData = responseData;
        this.shouldFail = shouldFail;
    }

    async fetch(url) {
        if (this.shouldFail) {
            throw new Error('Network error');
        }

        return {
            ok: true,
            json: async () => this.responseData
        };
    }
}

// RSS Feed functionality extracted for testing
class RSSFeedManager {
    constructor() {
        this.rssUrl = 'https://distrowatch.com/news/dw.xml';
        this.proxyUrl = 'https://api.allorigins.win/get?url=';
    }

    async fetchRSS(fetchFn = fetch) {
        const url = this.proxyUrl + encodeURIComponent(this.rssUrl);
        
        try {
            const response = await fetchFn(url);
            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            
            const items = xmlDoc.querySelectorAll('item');
            return this.parseItems(items);
        } catch (error) {
            console.error('Error fetching RSS:', error);
            throw error;
        }
    }

    parseItems(items) {
        const result = [];
        
        items.forEach((item, index) => {
            if (index >= 5) return; // Limit to 5 latest items
            
            const title = item.querySelector('title')?.textContent || 'No title';
            const link = item.querySelector('link')?.textContent || '#';
            const description = item.querySelector('description')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            
            result.push({
                title,
                link,
                description: description.substring(0, 200) + '...',
                pubDate: new Date(pubDate).toLocaleDateString()
            });
        });
        
        return result;
    }

    generateHTML(items) {
        if (items.length === 0) {
            return '<div class="error">No RSS items found</div>';
        }

        let html = '';
        items.forEach(item => {
            html += `
                <div class="rss-item">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="rss-date">${item.pubDate}</p>
                    <p class="rss-description">${item.description}</p>
                </div>
            `;
        });
        
        return html;
    }

    // Method to verify CSS styling
    verifyStyling() {
        const styles = {
            rssSection: {
                background: 'white',
                color: '#333'
            },
            rssItem: {
                background: '#f8f9fa',
                borderLeft: '4px solid #7cc9d1'
            },
            rssLink: {
                color: '#0066cc'
            }
        };
        return styles;
    }
}