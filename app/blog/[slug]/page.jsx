import { client } from "@/app/lib/sanity";
import { urlFor } from "@/app/lib/sanityImageUrl";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

async function getData({ slug }) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0]{
    title,
    slug,
    category,
    coverImage,
    content,
    readingTime,
    summary,
    author->{
      name,
      image
    },
    category->{
      category
    },

  }`;
  const data = await client.fetch(query);

  return data;
}

// get all posts

export async function getAllPosts() {
  const query = `*[_type == "post"]{
    title,
    slug,
    category,
    coverImage,
    content,
    readingTime,
    summary,
    author->{
      name,
      image
    },
    category->{
      category
    },

  }`;
  const data = await client.fetch(query);

  return data;
}

export default async function page({ params: { slug } }) {
  // get data
  const postData = await getData({ slug });

  // get othr posts except this one
  const otherPosts = await getAllPosts();

  const filteredPosts = otherPosts.filter((post) => post.slug.current !== slug);
  // limit to 3 posts
  const otherPostsLimited = filteredPosts.slice(0, 3);

  //console.log("otherPostsLimited", otherPostsLimited);

  const PortablTextComponent = {
    types: {
      image: (value) => (
        <Image
          src={urlFor(value).url()}
          alt="image"
          className=" rounded-lg"
          width={800}
          height={800}
        />
      ),
    },
  };

  return (
    <div>
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
      <header className="section_blog-post-header">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">
              <div className="margin-bottom margin-xxlarge">
                <div className="max-width-large">
                  <div className="blog-post-header_title-wrapper">
                    <div className="button-group margin-b">
                      <Link
                        href="#"
                        className="button is-link is-icon w-inline-block"
                      >
                        <div className="icon-embed-xxsmall w-embed">
                          <svg
                            width="16"
                            height="16"
                            viewbox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 13L6 8L11 3"
                              stroke="CurrentColor"
                              stroke-width="1.5"
                            ></path>
                          </svg>
                        </div>
                        <Link href="/">Alle nieuws</Link>
                      </Link>
                    </div>
                    <div className="blog-post-header_meta-wrapper">
                      <Link
                        href="#"
                        className="blog-post-header_category-link w-inline-block"
                      >
                        <div>{postData.category.category}</div>
                      </Link>
                      <div className="text-size-small text-weight-semibold text-inline">
                        {postData.readingTime} min read
                      </div>
                    </div>
                    <h1 className="heading-style-h2">{postData.title}</h1>
                  </div>
                </div>
              </div>
              <div className="blog-post-header_image-wrapper">
                <img
                  src={urlFor(postData.coverImage.asset).url()}
                  loading="eager"
                  alt=""
                  className="blog-post-header_image bg-cover bg-center"
                />
              </div>
              <div className="blog-post-header_content-bottom">
                <div className="blog-post-header_author-wrapper">
                  <div className="margin-right margin-large">
                    <div className="margin-bottom margin-xxsmall">
                      <div>Geschreven door</div>
                    </div>
                    <div className="text-weight-medium">
                      {postData.author.name}
                    </div>
                  </div>
                </div>
                <div className="w-layout-grid blog-post-header_share">
                  <Link
                    href="#"
                    className="blog-post-header_social-link w-inline-block"
                  >
                    <div className="blog-post-header_social-icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.9999 7.66008V8.00008C21.0007 9.06616 20.576 10.0885 19.8199 10.84L16.9999 13.67C16.4738 14.1911 15.6261 14.1911 15.1 13.67L15 13.56C14.8094 13.3656 14.8094 13.0544 15 12.86L18.4399 9.42006C18.807 9.03938 19.0083 8.52883 18.9999 8.00008V7.66008C19.0003 7.12705 18.788 6.61589 18.4099 6.2401L17.7599 5.59011C17.3841 5.21207 16.873 4.99969 16.3399 5.00011H15.9999C15.4669 4.99969 14.9558 5.21207 14.58 5.59011L11.14 9.00007C10.9456 9.19064 10.6344 9.19064 10.44 9.00007L10.33 8.89007C9.8089 8.36394 9.8089 7.51623 10.33 6.99009L13.16 4.15012C13.9165 3.40505 14.9382 2.99133 15.9999 3.00014H16.3399C17.4011 2.9993 18.4191 3.42018 19.1699 4.17012L19.8299 4.83012C20.5798 5.5809 21.0007 6.59891 20.9999 7.66008ZM8.64993 13.94L13.9399 8.65008C14.0338 8.55543 14.1616 8.50218 14.2949 8.50218C14.4282 8.50218 14.556 8.55543 14.6499 8.65008L15.3499 9.35007C15.4445 9.44395 15.4978 9.57175 15.4978 9.70507C15.4978 9.83839 15.4445 9.96618 15.3499 10.0601L10.0599 15.35C9.96604 15.4447 9.83824 15.4979 9.70492 15.4979C9.57161 15.4979 9.44381 15.4447 9.34993 15.35L8.64993 14.65C8.55528 14.5561 8.50204 14.4283 8.50204 14.295C8.50204 14.1617 8.55528 14.0339 8.64993 13.94ZM13.5599 15C13.3655 14.8094 13.0543 14.8094 12.8599 15L9.42993 18.41C9.0517 18.7905 8.53645 19.003 7.99995 18.9999H7.65995C7.12691 19.0004 6.61576 18.788 6.23997 18.41L5.58997 17.76C5.21194 17.3842 4.99956 16.873 4.99998 16.34V16C4.99956 15.4669 5.21194 14.9558 5.58997 14.58L9.00993 11.14C9.2005 10.9456 9.2005 10.6345 9.00993 10.44L8.89993 10.33C8.3738 9.80894 7.52609 9.80894 6.99996 10.33L4.17999 13.16C3.42392 13.9116 2.99916 14.9339 3 16V16.35C3.00182 17.4077 3.42249 18.4216 4.16999 19.1699L4.82998 19.8299C5.58076 20.5799 6.59878 21.0008 7.65995 20.9999H7.99995C9.05338 21.0061 10.0667 20.5964 10.8199 19.8599L13.6699 17.01C14.191 16.4838 14.191 15.6361 13.6699 15.11L13.5599 15Z"
                          fill="CurrentColor"
                        ></path>
                      </svg>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="blog-post-header_social-link w-inline-block"
                  >
                    <div className="blog-post-header_social-icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM8 18C8.27614 18 8.5 17.7761 8.5 17.5V10.5C8.5 10.2239 8.27614 10 8 10H6.5C6.22386 10 6 10.2239 6 10.5V17.5C6 17.7761 6.22386 18 6.5 18H8ZM7.25 9C6.42157 9 5.75 8.32843 5.75 7.5C5.75 6.67157 6.42157 6 7.25 6C8.07843 6 8.75 6.67157 8.75 7.5C8.75 8.32843 8.07843 9 7.25 9ZM17.5 18C17.7761 18 18 17.7761 18 17.5V12.9C18.0325 11.3108 16.8576 9.95452 15.28 9.76C14.177 9.65925 13.1083 10.1744 12.5 11.1V10.5C12.5 10.2239 12.2761 10 12 10H10.5C10.2239 10 10 10.2239 10 10.5V17.5C10 17.7761 10.2239 18 10.5 18H12C12.2761 18 12.5 17.7761 12.5 17.5V13.75C12.5 12.9216 13.1716 12.25 14 12.25C14.8284 12.25 15.5 12.9216 15.5 13.75V17.5C15.5 17.7761 15.7239 18 16 18H17.5Z"
                          fill="CurrentColor"
                        ></path>
                      </svg>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="blog-post-header_social-link w-inline-block"
                  >
                    <div className="blog-post-header_social-icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9728 6.7174C20.5084 7.33692 19.947 7.87733 19.3103 8.31776C19.3103 8.47959 19.3103 8.64142 19.3103 8.81225C19.3154 11.7511 18.1415 14.5691 16.0518 16.6345C13.962 18.6999 11.1312 19.8399 8.19405 19.7989C6.49599 19.8046 4.81967 19.4169 3.29642 18.6661C3.21428 18.6302 3.16131 18.549 3.16162 18.4593V18.3604C3.16162 18.2313 3.26623 18.1267 3.39527 18.1267C5.06442 18.0716 6.67402 17.4929 7.99634 16.4724C6.48553 16.4419 5.12619 15.5469 4.5006 14.1707C4.46901 14.0956 4.47884 14.0093 4.52657 13.9432C4.57429 13.8771 4.653 13.8407 4.73425 13.8471C5.19342 13.8932 5.65718 13.8505 6.1002 13.7212C4.43239 13.375 3.17921 11.9904 2.99986 10.2957C2.99349 10.2144 3.02992 10.1357 3.096 10.0879C3.16207 10.0402 3.24824 10.0303 3.32338 10.062C3.77094 10.2595 4.25409 10.3635 4.74324 10.3676C3.28184 9.40846 2.65061 7.58405 3.20655 5.92622C3.26394 5.76513 3.40181 5.64612 3.5695 5.61294C3.73718 5.57975 3.90996 5.63728 4.02432 5.76439C5.99639 7.86325 8.70604 9.11396 11.5819 9.25279C11.5083 8.95885 11.4721 8.65676 11.4741 8.35372C11.501 6.76472 12.4842 5.34921 13.9634 4.76987C15.4425 4.19054 17.1249 4.56203 18.223 5.71044C18.9714 5.56785 19.695 5.31645 20.3707 4.96421C20.4202 4.93331 20.483 4.93331 20.5325 4.96421C20.5634 5.01373 20.5634 5.07652 20.5325 5.12604C20.2052 5.87552 19.6523 6.50412 18.9509 6.92419C19.5651 6.85296 20.1685 6.70807 20.7482 6.49264C20.797 6.45942 20.8611 6.45942 20.9099 6.49264C20.9508 6.51134 20.9814 6.54711 20.9935 6.59042C21.0056 6.63373 20.998 6.68018 20.9728 6.7174Z"
                          fill="CurrentColor"
                        ></path>
                      </svg>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="blog-post-header_social-link w-inline-block"
                  >
                    <div className="blog-post-header_social-icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5 6H13.5C12.9477 6 12.5 6.44772 12.5 7V10H16.5C16.6137 9.99748 16.7216 10.0504 16.7892 10.1419C16.8568 10.2334 16.8758 10.352 16.84 10.46L16.1 12.66C16.0318 12.8619 15.8431 12.9984 15.63 13H12.5V20.5C12.5 20.7761 12.2761 21 12 21H9.5C9.22386 21 9 20.7761 9 20.5V13H7.5C7.22386 13 7 12.7761 7 12.5V10.5C7 10.2239 7.22386 10 7.5 10H9V7C9 4.79086 10.7909 3 13 3H16.5C16.7761 3 17 3.22386 17 3.5V5.5C17 5.77614 16.7761 6 16.5 6Z"
                          fill="CurrentColor"
                        ></path>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className="section_blog-post-content">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-bottom padding-xhuge">
              <div className="blog-post-content_component">
                <div className="blog-post-content_content">
                  <PortableText
                    value={postData.content}
                    components={PortablTextComponent}
                  />
                </div>
                <div className="blog-post-content_newsletter">
                  <div className="margin-bottom margin-xsmall">
                    <div className="heading-style-h6">
                      Abonneren op nieuwsbrief
                    </div>
                  </div>
                  <div className="margin-bottom margin-xsmall">
                    <p>
                    Abonneer om elke week de nieuwste blogberichten in je inbox te ontvangen.
                    </p>
                  </div>
                  <div className="blog-post-content_form w-form">
                    <form
                    >
                      <div className="blog-post-content_form-wrapper">
                        <input
                          type="email"
                          className="form_input w-input"
                          maxlength="256"
                          name="email-2"
                          data-name="Email 2"
                          placeholder="Enter your email"
                          id="email-2"
                          required=""
                        />
                        <input
                          type="submit"
                          value="Subscribe"
                          data-wait="Please wait..."
                          className="button is-small w-button"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="section_blog-post-related">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">
              <div className="blog-post-related_component">
                <div className="margin-bottom margin-xxlarge">
                  <div className="blog-post-related_heading-wrapper">
                    <div className="blog-post-related_heading">
                      <div className="max-width-large">
                        <div className="margin-bottom margin-xsmall">
                          <h2>Gerelateerde nieuwsartikelen</h2>
                        </div>
                        <p className="text-size-medium">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                    <div className="blog-post-related_button-row hide-mobile-landscape">
                      <Link href="/" className="button is-secondary w-button">
                        Bekijk meer
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="blog-post-related_list-wrapper">
                  <div className="w-layout-grid blog-post-related_list">
                    <div className="blog-post-related_item">
                      <Link
                        href={`/blog/${otherPostsLimited[0]?.slug?.current}`}
                        className="blog-post-related_item-link w-inline-block"
                      >
                        <div className="blog-post-related_image-wrapper">
                          <img
                            src={urlFor(
                              otherPostsLimited[0]?.coverImage?.asset
                            ).url()}
                            loading="lazy"
                            alt=""
                            className="blog-post-related_image"
                          />
                        </div>
                        <div className="blog-post-related_item-content">
                          <div className="blog-post-related_item-content-top">
                            <div className="blog-post-related_meta-wrapper">
                              <div className="blog-post-related_category">
                                <div className="text-size-small text-weight-semibold">
                                  {otherPostsLimited[0]?.category?.category}
                                </div>
                              </div>
                              <div className="text-size-small text-weight-semibold text-inline">
                                {otherPostsLimited[0]?.readingTime}
                                min read
                              </div>
                            </div>
                            <div className="blog-post-related_title-wrapper">
                              <h3 className="heading-style-h5">
                                {otherPostsLimited[0]?.title}
                              </h3>
                            </div>
                            <div className="text-size-regular line-clamp-2">
                              {otherPostsLimited[0]?.summary}
                            </div>
                          </div>
                          <div className="blog-post-related_button-wrapper">
                            <div className="button is-link is-icon">
                              <div>Lees meer</div>
                              <div className="icon-embed-xxsmall w-embed">
                                <svg
                                  width="16"
                                  height="16"
                                  viewbox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 3L11 8L6 13"
                                    stroke="CurrentColor"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="blog-post-related_item">
                      <Link
                        href={`/blog/${otherPostsLimited[1]?.slug?.current}`}
                        className="blog-post-related_item-link w-inline-block"
                      >
                        <div className="blog-post-related_image-wrapper">
                          <img
                            src={urlFor(
                              otherPostsLimited[1]?.coverImage?.asset
                            ).url()}
                            loading="lazy"
                            alt=""
                            className="blog-post-related_image"
                          />
                        </div>
                        <div className="blog-post-related_item-content">
                          <div className="blog-post-related_item-content-top">
                            <div className="blog-post-related_meta-wrapper">
                              <div className="blog-post-related_category">
                                <div className="text-size-small text-weight-semibold">
                                  {otherPostsLimited[1]?.category?.category}
                                </div>
                              </div>
                              <div className="text-size-small text-weight-semibold text-inline">
                                {otherPostsLimited[1]?.readingTime}
                                min read
                              </div>
                            </div>
                            <div className="blog-post-related_title-wrapper">
                              <h3 className="heading-style-h5">
                                {otherPostsLimited[1]?.title}
                              </h3>
                            </div>
                            <div className="text-size-regular line-clamp-2">
                              {otherPostsLimited[1]?.summary}
                            </div>
                          </div>
                          <div className="blog-post-related_button-wrapper">
                            <div className="button is-link is-icon">
                              <div>Lees meer</div>
                              <div className="icon-embed-xxsmall w-embed">
                                <svg
                                  width="16"
                                  height="16"
                                  viewbox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 3L11 8L6 13"
                                    stroke="CurrentColor"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="blog-post-related_item">
                      <Link
                        href={`/blog/${otherPostsLimited[2]?.slug?.current}`}
                        className="blog-post-related_item-link w-inline-block"
                      >
                        <div className="blog-post-related_image-wrapper">
                          <img
                            src={urlFor(
                              otherPostsLimited[2]?.coverImage?.asset
                            ).url()}
                            loading="lazy"
                            alt=""
                            className="blog-post-related_image"
                          />
                        </div>
                        <div className="blog-post-related_item-content">
                          <div className="blog-post-related_item-content-top">
                            <div className="blog-post-related_meta-wrapper">
                              <div className="blog-post-related_category">
                                <div className="text-size-small text-weight-semibold">
                                  {otherPostsLimited[2]?.category?.category}
                                </div>
                              </div>
                              <div className="text-size-small text-weight-semibold text-inline">
                                {otherPostsLimited[2]?.readingTime}
                                min read
                              </div>
                            </div>
                            <div className="blog-post-related_title-wrapper">
                              <h3 className="heading-style-h5">
                                {otherPostsLimited[2]?.title}
                              </h3>
                            </div>
                            <div className="text-size-regular line-clamp-2">
                              {otherPostsLimited[2]?.summary}
                            </div>
                          </div>
                          <div className="blog-post-related_button-wrapper">
                            <div className="button is-link is-icon">
                              <div>Lees meer</div>
                              <div className="icon-embed-xxsmall w-embed">
                                <svg
                                  width="16"
                                  height="16"
                                  viewbox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 3L11 8L6 13"
                                    stroke="CurrentColor"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="blog-post-related_button-row mobile-landscape">
                  <Link href="#" className="button is-secondary w-button">
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
