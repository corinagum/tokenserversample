# Token Server Sample 

## Roadmap
- [ ] Add SSH to `Dockerfile` so it stream the log to Azure
- [ ] Use AZ CLI in Travis CI to push the image, instead of using Azure Container Registry Webhooks
   - Performance improvment
   - Cost saving
- [ ] Enable CORS to limit the exposure
   - [ ] Instead of `GET`, limit to `POST`
   - [ ] Look at request "Origin" header to verify the requestor URL
   - [ ] Return OPTIONS call with error (404 or 401?) if not allowed
