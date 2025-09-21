function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

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

  const posts = json.data.posts.map((post) => {
    const date = new Date(post.date);
    const slug = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${slugify(post.postTitle)}`;
    return {
      ...post,
      slug,
    };
  });

  return posts;
}

export async function getPost(slug) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}
