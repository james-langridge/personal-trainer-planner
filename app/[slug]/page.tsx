import * as contentful from "contentful"
import "server-only"

// FIXME: avoid type assertion
const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

const getData = async (slug: string) => {
    return await client.getEntries({
        content_type: "page",
        "fields.slug": slug,
    });
}

export default async function Home({params}: any) {
    const { slug } = params;
    const page = await getData(slug);
    console.dir(page, {depth: null})

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  )
}
