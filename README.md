CS 321-001
Team 8

Members: Daniel Fuerlinger, Corey Wong, Phung Ngo

"!bb" for a menu with simple functionality
"!bb help" for complex function calls

BigBrotherBot is added to a server using the URL https://discord.com/api/oauth2/authorize?client_id=754512408633933875&permissions=0&scope=bot . Users are expected to give the bot the permission to ban/kick after adding the bot to the server.

BigBrotherTester is added to a server using the URL https://discord.com/oauth2/authorize?client_id=772522133510553600&scope=bot . Users can start the bot's test by typing the message "!Run BigBrotherTester" in a channel.

BigBrotherBot is run with "node index.js" when in the root directory. This must be initiated before the bot is added to any servers.
The tester bot is run with "node index.js" when in the BigBrotherTester directory. This must be initiated before the bot is added to any servers.
The tester.js script is run with "node tester.js" when in the root directory.