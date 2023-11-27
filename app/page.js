import Link from "next/link";
import { client } from "./lib/sanity";
import { urlFor } from "./lib/sanityImageUrl";

async function getData({ query }) {
  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const postDataQuery = `*[_type == "post"]`;
  const postData = await getData({ query: postDataQuery });
  //console.log(postData);

  // get author name from author reference
  const authorNameQuery = `*[_type == "author"]{
    _id,
    name,
    "imageUrl": image.asset->url
  }`;
  const authorData = await getData({ query: authorNameQuery });
  //console.log(authorData);

  // get author image from author reference
  const authorImageQuery = `*[_type == "author"]{
    _id,
    "imageUrl": image.asset->url
  }`;
  const authorImage = await getData({ query: authorImageQuery });
  //console.log(authorImage);

  // get category name from category reference
  const categoryNameQuery = `*[_type == "category"]`;
  const categoryData = await getData({ query: categoryNameQuery });

  // handle author image
  const getAuthorImage = (authorId) => {
    let authorImageUrl = "";
    authorImage.map((author) => {
      if (author._id === authorId) {
        authorImageUrl = author.imageUrl;
      }
    });
    return authorImageUrl;
  };

  return (
    <div className="page-wrapper">
      <div className="navbar_component w-nav">
        <div className="navbar_container flex justify-start">
          <a
            href="/"
            aria-current="page"
            className="navbar_link w-nav-link text-weight-bold"
          >
            CMD Amsterdam
          </a>
          <a href="/" aria-current="page" className="navbar_link w-nav-link">
            Nieuws
          </a>
        </div>
      </div>
      <main className="main-wrapper">
        <header className="section_blog-header">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-large">
                <div className="heading-head">
                  <div className="margin-bottom margin-xsmall">
                    <div className="text-weight-semibold">Het nieuws</div>
                  </div>
                  <div className="margin-bottom margin-small">
                    <h1>Check hier het laatste nieuws!</h1>
                  </div>
                  <p className="text-size-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                  </p>
                </div>
                <div className="blog-header_component">
                  <div className="blog-header_list-wrapper">
                    <div className="w-layout-grid blog-header_list">
                      {postData.map((post) => (
                        <div key={post._id} className="blog-header_item">
                          <Link
                            href={`/blog/${post?.slug?.current}`}
                            prefetch
                            className="blog-header_item-link w-inline-block"
                          >
                            <div className="blog-header_image-wrapper">
                              <img
                                src={urlFor(post?.coverImage?.asset).url()}
                                loading="lazy"
                                alt=""
                                className="blog-header_image"
                              />
                            </div>
                            <div className="blog-header_item-content">
                              <div className="blog-header_item-content-top">
                                <div className="blog-header_category-wrapper">
                                  <div className="text-size-small text-weight-semibold">
                                    {categoryData.map((category) =>
                                      category._id === post.category._ref
                                        ? category.category
                                        : null
                                    )}
                                  </div>
                                </div>
                                <div className="blog-header_title-wrapper">
                                  <h3 className="heading-style-h5">
                                    {post.title}
                                  </h3>
                                </div>
                                <div className="text-size-regular line-clamp-2">
                                  {post.summary}
                                </div>
                              </div>
                              <div className="blog-header_author-wrapper">
                                <div className="blog-header_author-image-wrapper">
                                  <img
                                    src={
                                      // get author image from authorImage
                                      getAuthorImage(post?.author?._ref)
                                    }
                                    loading="lazy"
                                    alt="PP"
                                    className="blog2-header_author-image"
                                  />
                                </div>
                                <div className="blog-header_author-text">
                                  <div className="text-size-small text-weight-semibold">
                                    {
                                      // get author name from author reference
                                      authorData?.map((author) =>
                                        author._id === post.author._ref
                                          ? author.name
                                          : null
                                      )
                                    }
                                  </div>
                                  <div className="blog-header_date-wrapper">
                                    <div className="text-size-small">
                                      {
                                        // 11 May 2021 format
                                        new Date(
                                          post._createdAt
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      }
                                    </div>
                                    <div className="blog-header_text-divider">
                                      •
                                    </div>
                                    <div className="text-size-small">
                                      {post.readingTime} min read
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </main>
    </div>
  );
}
