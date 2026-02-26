## Error Type
Console Error

## Error Message
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <RenderFromTemplateContext>
      <ScrollAndFocusHandler segmentPath={[...]}>
        <InnerScrollAndFocusHandler segmentPath={[...]} focusAndScrollRef={{apply:false, ...}}>
          <ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
            <LoadingBoundary name="/" loading={null}>
              <HTTPAccessFallbackBoundary notFound={<SegmentViewNode>} forbidden={undefined} unauthorized={undefined}>
                <HTTPAccessFallbackErrorBoundary pathname="/" notFound={<SegmentViewNode>} forbidden={undefined} ...>
                  <RedirectBoundary>
                    <RedirectErrorBoundary router={{...}}>
                      <InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} ...>
                        <SegmentViewNode type="page" pagePath="page.tsx">
                          <SegmentTrieNode>
                          <Home>
                            <main className="min-h-scre...">
                              <Hero>
                              <Partners>
                                <section
+                                 className="jsx-e246897ed6c267bf relative w-full py-16 md:py-24 bg-[#020202] overflow..."
-                                 className="jsx-710f55ee4372887d relative w-full py-16 md:py-24 bg-[#020202] overflow..."
                                >
                                  <JSXStyle>
                                  <div
+                                   className="jsx-e246897ed6c267bf absolute inset-0 circuit-bg opacity-30"
-                                   className="jsx-710f55ee4372887d absolute inset-0 circuit-bg opacity-30"
                                  >
                                  <div
+                                   className="jsx-e246897ed6c267bf absolute top-1/2 left-1/2 -translate-x-1/2 -transl..."
-                                   className="jsx-710f55ee4372887d absolute top-1/2 left-1/2 -translate-x-1/2 -transl..."
                                  >
                                  <div
+                                   className="jsx-e246897ed6c267bf relative z-10 max-w-7xl mx-auto px-6 mb-12 md:mb-16"
-                                   className="jsx-710f55ee4372887d relative z-10 max-w-7xl mx-auto px-6 mb-12 md:mb-16"
                                  >
                                    <div
+                                     className="jsx-e246897ed6c267bf flex flex-col items-center text-center"
-                                     className="jsx-710f55ee4372887d flex flex-col items-center text-center"
                                    >
                                      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} ...>
                                        <div className="flex items..." style={{opacity:0, ...}} ...>
                                          <div
+                                           className="jsx-e246897ed6c267bf w-1 h-5 bg-gradient-to-b from-[#2547D0] to..."
-                                           className="jsx-710f55ee4372887d w-1 h-5 bg-gradient-to-b from-[#2547D0] to..."
                                          >
                                          <span
+                                           className="jsx-e246897ed6c267bf partner-mono text-[10px] tracking-[0.3em] ..."
-                                           className="jsx-710f55ee4372887d partner-mono text-[10px] tracking-[0.3em] ..."
                                          >
+                                           Network
                                          <div
+                                           className="jsx-e246897ed6c267bf w-1 h-5 bg-gradient-to-b from-transparent ..."
-                                           className="jsx-710f55ee4372887d w-1 h-5 bg-gradient-to-b from-transparent ..."
                                          >
                                      <motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} ...>
                                        <h2 className="text-3xl m..." style={{opacity:0, ...}} ...>
                                          <span
+                                           className="jsx-e246897ed6c267bf text-white"
-                                           className="jsx-710f55ee4372887d text-white"
                                          >
+                                           {"Strategic "}
                                          <span
+                                           className="jsx-e246897ed6c267bf text-transparent bg-clip-text bg-gradient-..."
-                                           className="jsx-710f55ee4372887d text-transparent bg-clip-text bg-gradient-..."
                                          >
+                                           Partnerships
                                      ...
                                  <div
+                                   className="jsx-e246897ed6c267bf relative"
-                                   className="jsx-710f55ee4372887d relative"
                                  >
                                    <div
                                      style={{background:"linear-gra..."}}
+                                     className="jsx-e246897ed6c267bf absolute left-0 top-0 bottom-0 w-32 md:w-48 z-20..."
-                                     className="jsx-710f55ee4372887d absolute left-0 top-0 bottom-0 w-32 md:w-48 z-20..."
                                    >
                                    <div
                                      style={{background:"linear-gra..."}}
+                                     className="jsx-e246897ed6c267bf absolute right-0 top-0 bottom-0 w-32 md:w-48 z-2..."
-                                     className="jsx-710f55ee4372887d absolute right-0 top-0 bottom-0 w-32 md:w-48 z-2..."
                                    >
                                    <div
+                                     className="jsx-e246897ed6c267bf overflow-hidden"
-                                     className="jsx-710f55ee4372887d overflow-hidden"
                                    >
                                      <motion.div className="flex w-max" style={{x:{...}}}>
                                        <div className="flex w-max" style={{...}} ref={function useMotionRef.useCallback}>
                                          <div
                                            ref={{current:null}}
+                                           className="jsx-e246897ed6c267bf flex gap-6 md:gap-8 items-center py-8 pr-6..."
-                                           className="jsx-710f55ee4372887d flex gap-6 md:gap-8 items-center py-8 pr-6..."
                                          >
                                          <div
+                                           className="jsx-e246897ed6c267bf flex gap-6 md:gap-8 items-center py-8"
-                                           className="jsx-710f55ee4372887d flex gap-6 md:gap-8 items-center py-8"
                                          >
                                  <div
+                                   className="jsx-e246897ed6c267bf relative max-w-7xl mx-auto px-6 mt-12"
-                                   className="jsx-710f55ee4372887d relative max-w-7xl mx-auto px-6 mt-12"
                                  >
                                    <div
+                                     className="jsx-e246897ed6c267bf h-px bg-gradient-to-r from-transparent via-zinc-..."
-                                     className="jsx-710f55ee4372887d h-px bg-gradient-to-r from-transparent via-zinc-..."
                                    >
                              ...
                        ...
                      ...
          ...



    at _ (chrome-extension://egjidjbpglichdcondbcbdnbeeppgdph/inpage.js:166:26614)
    at w (chrome-extension://egjidjbpglichdcondbcbdnbeeppgdph/inpage.js:166:26798)
    at Y (chrome-extension://egjidjbpglichdcondbcbdnbeeppgdph/inpage.js:166:27157)
    at div (<anonymous>:null:null)
    at Partners (file://C:/Users/User/Desktop/penxchain.org/.next/dev/static/chunks/src_components_eddf6b04._.js:533:215)
    at Home (src\app\page.tsx:16:7)

## Code Frame
  14 |     <main className="min-h-screen bg-penx-bg">
  15 |       <Hero />
> 16 |       <Partners />
     |       ^
  17 |       <Features />
  18 |       <HowItWorks />
  19 |       <Ecosystem />

Next.js version: 16.1.6 (Turbopack)




## Error Type
Runtime i

## Error Message
Failed to connect to MetaMask


    at Object.connect (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/scripts/inpage.js:1:63510)
    at async s (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/scripts/inpage.js:1:61013)

Next.js version: 16.1.6 (Turbopack)
