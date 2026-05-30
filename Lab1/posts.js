// Use https://gorest.co.in/ REST API for Testing and Prototyping
// Write function to fetch data from https://gorest.co.in/public/v2/posts
// This function should print in console array of obects with the following structure {id, title, user_id}
// and handle possible errors 
async function fetchPosts() {
    try {
        const response = await fetch('https://gorest.co.in/public/v2/posts');
        
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const posts = await response.json();

        const formattedData = posts.map(post => {
            return {
                id: post.id,
                title: post.title,
                user_id: post.user_id
            };
        });

        console.log('Отримані пости:');
        console.log(formattedData);

    } catch (error) {
        console.error('Сталася помилка під час отримання даних:', error.message);
    }
}

fetchPosts();