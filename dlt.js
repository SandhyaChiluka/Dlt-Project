const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    // Fetch the HTML content from the Time.com website
    const url = 'https://time.com';
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        https.get(url, (response) => {
            let html_content = '';

            // Concatenate chunks of HTML content
            response.on('data', (chunk) => {
                html_content += chunk;
            });

            response.on('end', () => {
                // Find the index of the "LATEST STORIES" section
                const start_index = html_content.indexOf('LATEST STORIES');
                // Extract the text from the "LATEST STORIES" section onwards
                const latest_stories_text = html_content.slice(start_index);

                // Split the text into lines
                const lines = latest_stories_text.split('\n');

                // Filter out empty lines and extract the latest 6 stories
                const latest_stories = lines
                    .map(line => line.trim())
                    .filter(line => line !== '')
                    .slice(0, 6);

                // Construct the JSON response
                const json_response = JSON.stringify(latest_stories.reduce((acc, _, i, arr) => {
                    if (i % 2 === 0) {
                        acc.push({ title: arr[i], link: arr[i + 1] });
                    }
                    return acc;
                }, []), null, 2);

                // Send the JSON response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(json_response);
            });
        }).on('error', (err) => {
            console.error(`Error fetching content from ${url}: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
    } else {
        // Return a 404 for other paths
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});