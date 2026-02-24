im trying to login and signup and im seeing these errors in the backend log


penxchain-backend.onrender.com/waitlist/tasks clientIP="36.69.96.241" requestID="5f9bbc7c-735c-46a7" responseTimeMS=1 responseBytes=1064 userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36"
[OPTIONS]
penxchain-backend.onrender.com/waitlist/tasks clientIP="36.69.96.241" requestID="b1845ae2-de94-4eab" responseTimeMS=1 responseBytes=1064 userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36"
[GET]
penxchain-backend.onrender.com/auth/check-referral?code=PNX-H47L79 clientIP="36.69.96.241" requestID="6e941210-6631-41c7" responseTimeMS=18 responseBytes=1143 userAgent="Mozilla/5.0 (Linux; Android 15; CPH2821 Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36 OKEx-ACE528206/6.148.1 (CPH2821; U; Android 15; id-ID;) locale=id-ID statusBarHeight/83 OKApp/(OKEx/6.148.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/dark"
[GET]
penxchain-backend.onrender.com/auth/check-referral?code=PNX-H47L79 clientIP="36.69.96.241" requestID="3fc4e403-959d-4d95" responseTimeMS=15 responseBytes=1143 userAgent="Mozilla/5.0 (Linux; Android 15; CPH2821 Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36 OKEx-ACE528206/6.148.1 (CPH2821; U; Android 15; id-ID;) locale=id-ID statusBarHeight/83 OKApp/(OKEx/6.148.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/dark"
[GET]
penxchain-backend.onrender.com/auth/check-referral?code=PNX-H47L79 clientIP="36.69.96.241" requestID="ec4bdec8-d621-4c88" responseTimeMS=15 responseBytes=1143 userAgent="Mozilla/5.0 (Linux; Android 15; CPH2821 Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36 OKEx-ACE528206/6.148.1 (CPH2821; U; Android 15; id-ID;) locale=id-ID statusBarHeight/83 OKApp/(OKEx/6.148.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/dark"
prisma:error 
Invalid `prisma.user.findFirst()` invocation:
The table `public.User` does not exist in the current database.
[2026-02-24 15:30:43.817 +0000] ERROR: Request error
    reqId: "req-38"
    request: {
      "method": "GET",
      "url": "/auth/check-referral?code=PNX-H47L79"
    }
    err: {
      "type": "Object",
      "message": "\nInvalid `prisma.user.findFirst()` invocation:\n\n\nThe table `public.User` does not exist in the current database.",
      "stack":
          PrismaClientKnownRequestError: 
          Invalid `prisma.user.findFirst()` invocation:
          
          
          The table `public.User` does not exist in the current database.
              at Vr.handleRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:8172)
              at Vr.handleAndLogRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7467)
              at Vr.request (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7174)
              at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
              at async a (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:75:5816)
              at async checkReferralCode (/opt/render/project/src/backend/dist/src/modules/auth/service.js:295:18)
              at async Object.checkReferralHandler (/opt/render/project/src/backend/dist/src/modules/auth/controller.js:30:21)
      "code": "P2021",
      "name": "PrismaClientKnownRequestError"
    }
[2026-02-24 15:30:43.817 +0000] ERROR: Database operation failed
    reqId: "req-38"
    type: "DATABASE_ERROR"
    originalMessage: "\nInvalid `prisma.user.findFirst()` invocation:\n\n\nThe table `public.User` does not exist in the current database."
    code: "P2021"
prisma:error 
Invalid `prisma.user.findFirst()` invocation:
The table `public.User` does not exist in the current database.
[2026-02-24 15:30:44.830 +0000] ERROR: Request error
    reqId: "req-39"
    request: {
      "method": "GET",
      "url": "/auth/check-referral?code=PNX-H47L79"
    }
    err: {
      "type": "Object",
      "message": "\nInvalid `prisma.user.findFirst()` invocation:\n\n\nThe table `public.User` does not exist in the current database.",
      "stack":
          PrismaClientKnownRequestError: 
          Invalid `prisma.user.findFirst()` invocation:
          
          
          The table `public.User` does not exist in the current database.
              at Vr.handleRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:8172)
              at Vr.handleAndLogRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7467)
              at Vr.request (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7174)
              at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
              at async a (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:75:5816)
              at async checkReferralCode (/opt/render/project/src/backend/dist/src/modules/auth/service.js:295:18)
              at async Object.checkReferralHandler (/opt/render/project/src/backend/dist/src/modules/auth/controller.js:30:21)
      "code": "P2021",
      "name": "PrismaClientKnownRequestError"
    }
[2026-02-24 15:30:44.830 +0000] ERROR: Database operation failed
    reqId: "req-39"
    type: "DATABASE_ERROR"
    originalMessage: "\nInvalid `prisma.user.findFirst()` invocation:\n\n\nThe table `public.User` does not exist in the current database."
    code: "P2021"
prisma:error 
Invalid `prisma.user.findFirst()` invocation:
    originalMessage: "\nInvalid `prisma.user.findFirst()` invocation:\n\n\nThe table `public.User` does not exist in the current database."
    code: "P2021"
[OPTIONS]
penxchain-backend.onrender.com/waitlist/time clientIP="103.83.93.209" requestID="176feaa6-a461-4217" responseTimeMS=1 responseBytes=1064 userAgent="Mozilla/5.0 (Linux; Android 13; RMX3834 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Mobile Safari/537.36 OKX-Wallet-google/6.158.1 (RMX3834; U; Android 13; in-ID;) locale=in-ID statusBarHeight/82 OKApp/(OKX-Wallet/6.158.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/light"
[OPTIONS]
penxchain-backend.onrender.com/waitlist/tasks clientIP="103.83.93.209" requestID="858c7f3a-5b8a-417c" responseTimeMS=1 responseBytes=1064 userAgent="Mozilla/5.0 (Linux; Android 13; RMX3834 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Mobile Safari/537.36 OKX-Wallet-google/6.158.1 (RMX3834; U; Android 13; in-ID;) locale=in-ID statusBarHeight/82 OKApp/(OKX-Wallet/6.158.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/light"
[OPTIONS]
penxchain-backend.onrender.com/waitlist/time clientIP="103.83.93.209" requestID="e5942ef2-65ad-44ba" responseTimeMS=1 responseBytes=1064 userAgent="Mozilla/5.0 (Linux; Android 13; RMX3834 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Mobile Safari/537.36 OKX-Wallet-google/6.158.1 (RMX3834; U; Android 13; in-ID;) locale=in-ID statusBarHeight/82 OKApp/(OKX-Wallet/6.158.1) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/light"

