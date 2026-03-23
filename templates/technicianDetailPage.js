/**
 * Generate HTML for technician detail page
 * @param {Object} technician - Technician object from database
 * @returns {string} HTML content
 */
function generateTechnicianDetailHTML(technician) {
    // Generate gallery items dynamically
    const galleryItems = (technician.gallery || []).map((image, index) => `
    <div class="gallery-item-container">
      <div class="gallery-item-wrapper">
        <div class="gallery-item-content">
          <img src="${image}" alt="${technician.name} gallery ${index + 1}" loading="lazy">
        </div>
      </div>
      <div class="item-action">View Image</div>
    </div>
  `).join('');

    return `
<html lang="en" style="scroll-padding-top: 158px;">

<head>
    <title>${technician.name} | Poshkroom</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" id="wixDesktopViewport">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="generator" content="Wix.com Website Builder">
    <link rel="icon" sizes="192x192" href="https://static.parastorage.com/client/pfavico.ico" type="image/x-icon">
    <link rel="shortcut icon" href="https://static.parastorage.com/client/pfavico.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="https://static.parastorage.com/client/pfavico.ico" type="image/x-icon">
    <meta name="format-detection" content="telephone=no">
    <meta name="skype_toolbar" content="skype_toolbar_parser_compatible">
    <meta http-equiv="X-Wix-Meta-Site-Id" content="e36dc349-ce14-4268-ac29-6b7043055246">
    <meta http-equiv="X-Wix-Application-Instance-Id" content="befeed5b-1e54-42b9-a8c0-b998c6d60c70">
    <meta http-equiv="X-Wix-Published-Version" content="3754">
    <meta http-equiv="etag" content="bug">
    <link rel="canonical" href="https://www.poshkroom.com/${technician.slug}">
    <meta name="robots" content="noindex">
    <meta property="og:title" content="${technician.name} | Poshkroom">
    <meta property="og:url" content="https://www.poshkroom.com/${technician.slug}">
    <meta property="og:site_name" content="Poshkroom">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${technician.name} | Poshkroom">
    
    <style>
    /* Professional CSS for Technician Detail Page */
    
    :root {
      --primary-color: #2563eb;
      --secondary-color: #64748b;
      --background-color: #f8fafc;
      --text-color: #1e293b;
      --border-color: #e2e8f0;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --border-radius: 8px;
      --transition: all 0.3s ease;
    }
    
    #SCROLL_TO_TOP,
    #SCROLL_TO_BOTTOM {
      display: none;
    }
    
    .site-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(40, 40, 40, 0.96));
      border-bottom: 1px solid rgba(221, 185, 103, 0.25);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .gallery-item-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 8px;
      background: #f0f0f0;
    }
    
    .gallery-item-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
    }
    
    .gallery-item-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .gallery-item-content img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    
    .gallery-item-container:hover .gallery-item-content img {
      transform: scale(1.05);
    }
    
    .item-action {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .gallery-item-container:hover .item-action {
      opacity: 1;
    }
    
    .gallery-title {
      font-size: 24px;
      font-weight: bold;
      color: #2c2c2c;
      margin: 30px 0 20px 0;
    }
    
    .technician-gallery {
      margin: 50px 0;
    }
    </style>
</head>

<body class="">
    <svg data-dom-store="" style="display:none">
        <defs id="dom-store-defs"></defs>
    </svg>

    <div id="SITE_CONTAINER">
        <div id="main_MF" class="main_MF">
            <div id="SCROLL_TO_TOP" class="Vd6aQZ ignore-focus SCROLL_TO_TOP" role="region" tabindex="-1"
                aria-label="top of page"><span class="mHZSwn">top of page</span></div>
            
            <div id="site-root" class="site-root">
                <div id="masterPage" class="mesh-layout masterPage css-editing-scope">
                  <header id="SITE_HEADER" class="xU8fqS SITE_HEADER wixui-header" tabindex="-1"><div class="_C0cVf"><div class="_4XcTfy" data-testid="screenWidthContainerBg"></div></div><div class="U4Bvut"><div class="G5K6X8"><div class="gUbusX" data-testid="screenWidthContainerBgCenter"></div></div><div class="CJF7A2"><div data-mesh-id="SITE_HEADERinlineContent" data-testid="inline-content" class=""><div data-mesh-id="SITE_HEADERinlineContent-gridContainer" data-testid="mesh-container-content"><div id="comp-irxld1lr" class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-irxld1lr wixui-rich-text" data-testid="richTextElement"><p class="font_6 wixui-rich-text__text" style="font-size:30px; line-height:normal; text-align:center;"><span style="font-size:30px;" class="wixui-rich-text__text"><span style="text-shadow:rgba(255, 255, 255, 0.6) 1px 1px 1px, rgba(0, 0, 0, 0.6) -1px -1px 1px;" class="wixui-rich-text__text"><span style="color:#DDB967;" class="wixui-rich-text__text"><span style="font-family:snellroundhandw01-scrip,cursive;" class="wixui-rich-text__text"><span style="letter-spacing:normal;" class="wixui-rich-text__text"><a href="https://www.poshkroom.com" target="_self" class="wixui-rich-text__text">Posh K-Room</a></span></span></span></span></span></p></div><wix-dropdown-menu id="comp-irys4v5c" class="XwCBRN NHM1d1 comp-irys4v5c wixui-dropdown-menu hidden-during-prewarmup" tabindex="-1" dir="ltr" data-stretch-buttons-to-menu-width="false" data-same-width-buttons="false" data-num-items="5" data-menuborder-y="0" data-menubtn-border="0" data-ribbon-els="0" data-label-pad="0" data-ribbon-extra="0" data-dropalign="right" style="visibility: inherit; overflow-x: visible;" data-dropmode="dropDown"><nav class="R_TAzU" id="comp-irys4v5cnavContainer" aria-label="Site"><ul class="y7qwii" id="comp-irys4v5citemsContainer" style="text-align:right" data-marginallchildren="true"><li id="comp-irys4v5c0" data-direction="ltr" data-listposition="center" data-data-id="dataItem-jb3n1br8" data-state="menu false  link" data-index="0" class="Tg1gOB wixui-dropdown-menu__item xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="false" style="width: 71px; height: 50px; position: relative; box-sizing: border-box; overflow: visible; visibility: inherit;"><a data-testid="linkElement" href="https://www.poshkroom.com" target="_self" class="UiHgGh"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c0label" style="line-height: 50px;">Home</p></div></div></a></li><li id="comp-irys4v5c1" data-direction="ltr" data-listposition="center" data-data-id="dataItem-jb3npf4k" data-state="menu false  link" data-index="1" class="Tg1gOB wixui-dropdown-menu__item xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="false" style="width: 72px; height: 50px; position: relative; box-sizing: border-box; overflow: visible; visibility: inherit;"><a data-testid="linkElement" data-anchor="dataItem-jb3nkz0d" href="https://www.poshkroom.com" target="_self" class="UiHgGh"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c1label" style="line-height: 50px;">About</p></div></div></a></li><li id="comp-irys4v5c2" data-direction="ltr" data-listposition="center" data-data-id="dataItem-lxnx0ndu" data-state="menu false  link" data-index="2" class="Tg1gOB wixui-dropdown-menu__item xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="false" style="width: 80px; height: 50px; position: relative; box-sizing: border-box; overflow: visible; visibility: inherit;"><a data-testid="linkElement" data-anchor="dataItem-lxnwviye" href="https://www.poshkroom.com" target="_self" class="UiHgGh"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c2label" style="line-height: 50px;">Models</p></div></div></a></li><li id="comp-irys4v5c3" data-direction="ltr" data-listposition="center" data-data-id="dataItem-it8bx81q" data-state="menu false  link" data-index="3" class="Tg1gOB wixui-dropdown-menu__item xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="false" style="width: 92px; height: 50px; position: relative; box-sizing: border-box; overflow: visible; visibility: inherit;"><a data-testid="linkElement" href="https://www.poshkroom.com/etiquette" target="_self" class="UiHgGh"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c3label" style="line-height: 50px;">Etiquette</p></div></div></a></li><li id="comp-irys4v5c4" data-direction="ltr" data-listposition="right" data-data-id="dataItem-jb3nq42y" data-state="menu false  link" data-index="4" class="Tg1gOB wixui-dropdown-menu__item xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="false" style="width: 83px; height: 50px; position: relative; box-sizing: border-box; overflow: visible; visibility: inherit;"><a data-testid="linkElement" data-anchor="anchors-lxnszdic" href="https://www.poshkroom.com" target="_self" class="UiHgGh"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c4label" style="line-height: 50px;">Contact</p></div></div></a></li><li id="comp-irys4v5c__more__" data-direction="ltr" data-listposition="right" data-state="menu false  header" data-index="__more__" data-dropdown="false" class="p90CkU xTjc1A" data-original-gap-between-text-and-btn="10" aria-hidden="true" style="height: 0px; overflow: hidden; position: absolute; visibility: hidden;"><div data-testid="linkElement" class="UiHgGh" tabindex="0" aria-haspopup="true"><div class="yRj2ms"><div class=""><p class="JS76Uv" id="comp-irys4v5c__more__label" tabindex="-1">More</p></div></div></div></li></ul><div class="h3jCPd" id="comp-irys4v5cdropWrapper" data-dropalign="right" data-dropdown-shown="false"><ul class="wkJ2fp wixui-dropdown-menu__submenu" id="comp-irys4v5cmoreContainer"></ul></div><div style="display:none" id="comp-irys4v5cnavContainer-hiddenA11ySubMenuIndication">Use tab to navigate through the menu items.</div></nav></wix-dropdown-menu><div id="comp-irxlh5oq" class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-irxlh5oq wixui-rich-text" data-testid="richTextElement"><p class="font_9 wixui-rich-text__text" style="line-height:normal; text-align:center; font-size:14px;"><a href="https://www.poshkroom.com" target="_self" class="wixui-rich-text__text"><span style="letter-spacing:0.15em;" class="wixui-rich-text__text">Upscale <span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-weight:bold;" class="wixui-rich-text__text">I</span></span> Discreet <span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-weight:700;" class="wixui-rich-text__text">I</span></span>&nbsp;Class</span></a><br class="wixui-rich-text__text">
<span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-weight:bold;" class="wixui-rich-text__text">(929) 558-5880</span>.</span></p></div><div id="comp-m917wyx4" class="MazNVa comp-m917wyx4 wixui-image rYiAuL"><a data-testid="linkElement" href="https://bsky.app/profile/poshkroom.bsky.social" target="_blank" rel="noreferrer noopener" class="j7pOnl"><img fetchpriority="high" sizes="94px" srcset="https://static.wixstatic.com/media/80b714_8697eea38bd44a25b266860c980c7e1f~mv2.jpg/v1/fill/w_94,h_35,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bluesky_jfif.jpg 1x, https://static.wixstatic.com/media/80b714_8697eea38bd44a25b266860c980c7e1f~mv2.jpg/v1/fill/w_188,h_70,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bluesky_jfif.jpg 2x" id="img_comp-m917wyx4" src="https://static.wixstatic.com/media/80b714_8697eea38bd44a25b266860c980c7e1f~mv2.jpg/v1/fill/w_94,h_35,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bluesky_jfif.jpg" alt="bluesky.jfif" style="object-fit:cover" class="BI8PVQ Tj01hh" width="94" height="35"></a></div></div></div></div></div></header>
                    <main id="PAGES_CONTAINER" class="PAGES_CONTAINER" tabindex="-1" data-main-content="true">
                        <div id="SITE_PAGES" class="JsJXaX SITE_PAGES">
                            <div id="SITE_PAGES_TRANSITION_GROUP" class="AnQkDU">
                                <div id="c9piu" class="fEm0Bo zK7MhX theme-vars c9piu">
                                    <div class="c7cMWz wixui-page" data-testid="page-bg"></div>
                                    <div class="FVGvCX">
                                        <div id="Containerc9piu" class="Containerc9piu SPY_vo">
                                            <div data-mesh-id="Containerc9piuinlineContent" data-testid="inline-content" class="">
                                                <div data-mesh-id="Containerc9piuinlineContent-gridContainer"
                                                    data-testid="mesh-container-content">
                                                    <section id="comp-lzu54htq" tabindex="-1"
                                                        class="Oqnisf comp-lzu54htq wixui-section"
                                                        data-block-level-container="ClassicSection">
                                                        <div data-mesh-id="comp-lzu54htqinlineContent"
                                                            data-testid="inline-content" class="">
                                                            <div data-mesh-id="comp-lzu54htqinlineContent-gridContainer"
                                                                data-testid="mesh-container-content">
                                                                <section id="comp-lzu54hu2"
                                                                    class="comp-lzu54hu2 CohWsy wixui-column-strip">
                                                                    <div data-testid="columns" class="V5AUxf">
                                                                        <div id="comp-lzu54hu65"
                                                                            class="comp-lzu54hu65 YzqVVZ wixui-column-strip__column">
                                                                            <div id="bgMedia_comp-lzu54hu65"
                                                                                data-motion-part="BG_MEDIA comp-lzu54hu65"
                                                                                class="VgO9Yg">
                                                                                <img src="${technician.cover || '/images/placeholder.jpg'}"
                                                                                    alt="${technician.name}"
                                                                                    style="width: 100%; height: 500px; object-fit: cover;">
                                                                            </div>
                                                                            <div data-mesh-id="comp-lzu54hu65inlineContent"
                                                                                data-testid="inline-content" class="">
                                                                                <div data-mesh-id="comp-lzu54hu65inlineContent-gridContainer"
                                                                                    data-testid="mesh-container-content">
                                                                                    <div id="comp-lzu54hup1"
                                                                                        class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-lzu54hup1 wixui-rich-text"
                                                                                        data-testid="richTextElement">
                                                                                        <h1 class="font_2 wixui-rich-text__text"
                                                                                            style="line-height:1.2em; font-size:42px; color:#FAFAFA; letter-spacing:-0.1em;">
                                                                                            ${technician.name.toUpperCase()}
                                                                                        </h1>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <section id="comp-lzu54hut4" tabindex="-1"
                                                        class="Oqnisf comp-lzu54hut4 wixui-section"
                                                        data-block-level-container="ClassicSection">
                                                        <div data-mesh-id="comp-lzu54hut4inlineContent"
                                                            data-testid="inline-content" class="">
                                                            <div data-mesh-id="comp-lzu54hut4inlineContent-gridContainer"
                                                                data-testid="mesh-container-content">
                                                                <div id="comp-lzu54huv"
                                                                    class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-lzu54huv wixui-rich-text"
                                                                    data-testid="richTextElement">
                                                                    <h2 class="font_4 wixui-rich-text__text"
                                                                        style="line-height:normal; font-size:23px; color:#DDB967; letter-spacing:0.04em;">
                                                                        Meet ${technician.name}
                                                                    </h2>
                                                                </div>

                                                                <div id="comp-lzu54hux2"
                                                                    class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-lzu54hux2 wixui-rich-text"
                                                                    data-testid="richTextElement">
                                                                    <p class="font_7 wixui-rich-text__text"
                                                                        style="font-size:17px;">
                                                                        ${technician.description}
                                                                    </p>
                                                                </div>

                                                                <div id="comp-lzu54huz1" class="KaEeLN comp-lzu54huz1">
                                                                    <div class="uYj0Sg wixui-box"
                                                                        data-testid="container-bg"></div>
                                                                    <div data-mesh-id="comp-lzu54huz1inlineContent"
                                                                        data-testid="inline-content" class="">
                                                                        <div data-mesh-id="comp-lzu54huz1inlineContent-gridContainer"
                                                                            data-testid="mesh-container-content">
                                                                            <div id="comp-lzu54hv15"
                                                                                class="MazNVa comp-lzu54hv15 wixui-image rYiAuL">
                                                                                <img src="${technician.avatar || '/images/placeholder.jpg'}"
                                                                                    alt="${technician.name}"
                                                                                    style="width: 252px; height: 252px; object-fit: cover; border-radius: 8px;">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div id="comp-lzu54hv35"
                                                                    class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-lzu54hv35 wixui-rich-text"
                                                                    data-testid="richTextElement">
                                                                    <p class="font_8 wixui-rich-text__text"
                                                                        style="font-size:15px;">
                                                                        ${technician.shortDescription}
                                                                    </p>
                                                                </div>

                                                                <div class="technician-gallery">
                                                                    <h2 class="gallery-title">Gallery</h2>
                                                                    <div class="gallery-grid">
                                                                        ${galleryItems}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer id="SITE_FOOTER" class="x4zVYf SITE_FOOTER wixui-footer" tabindex="-1">
                        <div class="kn76TK">
                            <div data-mesh-id="SITE_FOOTERinlineContent" data-testid="inline-content" class="">
                                <div data-mesh-id="SITE_FOOTERinlineContent-gridContainer"
                                    data-testid="mesh-container-content">
                                    <div id="comp-irvyvkhz"
                                        class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-irvyvkhz wixui-rich-text"
                                        data-testid="richTextElement">
                                        <p class="font_6 wixui-rich-text__text"
                                            style="line-height:normal; font-size:17px; color:#DDB967;">Contact Us</p>
                                    </div>
                                    <div id="comp-isk9y3ew"
                                        class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-isk9y3ew wixui-rich-text"
                                        data-testid="richTextElement">
                                        <p class="font_8 wixui-rich-text__text" style="font-size:15px;">Premier K-Agency
                                            in LIC, New York</p>
                                        <p class="font_8 wixui-rich-text__text" style="font-size:15px;">
                                            <span style="font-weight:bold;">(929) 558-5880</span>
                                        </p>
                                        <p class="font_8 wixui-rich-text__text" style="font-size:15px;">Text Only to
                                            inquire. No Calls.</p>
                                        <p class="font_8 wixui-rich-text__text" style="line-height:1.7em; font-size:15px;">
                                            Email: <a href="mailto:poshkroom@gmail.com">poshkroom@gmail.com</a>
                                        </p>
                                    </div>
                                    <div id="comp-irvzpphf"
                                        class="ku3DBC zQ9jDz qvSjx3 Vq6kJx comp-irvzpphf wixui-rich-text"
                                        data-testid="richTextElement">
                                        <p class="font_9 wixui-rich-text__text"
                                            style="line-height:1.6em; font-size:14px; letter-spacing:0.04em;">
                                            © 2024 by Posh K Room. All Rights Reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <div id="SCROLL_TO_BOTTOM" class="Vd6aQZ ignore-focus SCROLL_TO_BOTTOM" role="region" tabindex="-1"
                aria-label="bottom of page"><span class="mHZSwn">bottom of page</span></div>
        </div>
    </div>
</body>

</html>
  `;
}

module.exports = { generateTechnicianDetailHTML };
