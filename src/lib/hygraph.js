export async function getPosts() {
  const query = `
    query BlogPosts {
      posts {
        postTitle
        body {
          html
        }
        date
        photos {
          url(transformation:{ image:{resize: {width:1600}}})
        }
      }
    }
  `;

  const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error(json.errors);
    return [];
  }

  return json.data.posts;
}
