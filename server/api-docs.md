# Ombud API Test:

## Consumer Complaint Query and Aggregation API  v0.0.1


### Complaints

####`GET /complaints`

Returns an array of all complaint data.  Default limit is 10 records unless the `limit` param is set.

   *Query Params*:

  * `?company`:

  * Example:
    * Request: `api/v1/complaints?company=bank%20of%20america`
    * Response:
      * status: 200
      * body:
        [
          {"date_received":"10/28/2017","product":"Checking or savings account","sub-product":"Checking account","issue":"Problem caused by your funds being low","sub-issue":"Non-sufficient funds and associated fees","consumer_complaint_narrative":"","company_public_response":"Company has responded to the consumer and the CFPB and chooses not to provide a public response","company":"BANK OF AMERICA, NATIONAL ASSOCIATION","state":"CA","zip_code":92311,"tags":"","consumer_consent_provided?":"Consent not provided","submitted_via":"Web","date_sent_to_company":"10/28/2017","company_response_to_consumer":"Closed with monetary relief","timely_response?":"Yes","consumer_disputed?":"N/A","complaint_id":2714104,"product_id":"checking_or_savings_account","subproduct_id":"checking_account"},
          ...
          {"date_received":"10/25/2017","product":"Mortgage","sub-product":"Conventional home mortgage","issue":"Trouble during payment process","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"Company has responded to the consumer and the CFPB and chooses not to provide a public response","company":"BANK OF AMERICA, NATIONAL ASSOCIATION","state":"FL","zip_code":33178,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Fax","date_sent_to_company":"10/25/2017","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"N/A","complaint_id":2712135,"product_id":"mortgage","subproduct_id":"conventional_home_mortgage"}
        ]


  Returns an array of complaint data filtered for a given company.

  * `?productId`:

  * Example:
    * Request: `api/v1/complaints?productId=credit_card`
    * Response:
      * status: 200
      * body:
        [
          {"date_received":"09/14/2015","product":"Credit card","sub-product":"","issue":"Identity theft / Fraud / Embezzlement","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"","company":"CAPITAL ONE FINANCIAL CORPORATION","state":"MD","zip_code":20902,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Referral","date_sent_to_company":"09/16/2015","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"No","complaint_id":1563246,"product_id":"credit_card","subproduct_id":""},
          {"date_received":"09/14/2015","product":"Credit card","sub-product":"","issue":"Other","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"Company chooses not to provide a public response","company":"CITIBANK, N.A.","state":"CA","zip_code":92692,"tags":"Older American","consumer_consent_provided?":"Consent not provided","submitted_via":"Web","date_sent_to_company":"09/15/2015","company_response_to_consumer":"Closed with monetary relief","timely_response?":"Yes","consumer_disputed?":"No","complaint_id":1562964,"product_id":"credit_card","subproduct_id":""},
          ...
          {"date_received":"09/12/2015","product":"Credit card","sub-product":"","issue":"Billing disputes","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"Company believes it acted appropriately as authorized by contract or law","company":"UNITED SERVICES AUTOMOBILE ASSOCIATION","state":"OR","zip_code":97229,"tags":"","consumer_consent_provided?":"Consent not provided","submitted_via":"Web","date_sent_to_company":"09/12/2015","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"No","complaint_id":1562054,"product_id":"credit_card","subproduct_id":""}]

  Returns an array of complaint data filtered for a given product_id.

  * `?state`:

  * Example:
    * Request: `api/v1/complaints?state=NY`
    * Response:
      * status: 200
      * body:
        [
          {"date_received":"01/23/2018","product":"Debt collection","sub-product":"Federal student loan debt","issue":"Written notification about debt","sub-issue":"Didn't receive enough information to verify debt","consumer_complaint_narrative":"","company_public_response":"","company":"Navient Solutions, LLC.","state":"NY","zip_code":11380,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Fax","date_sent_to_company":"01/23/2018","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"N/A","complaint_id":2791416,"product_id":"debt_collection","subproduct_id":"federal_student_loan_debt"},
          ...
          {"date_received":"01/22/2018","product":"Vehicle loan or lease","sub-product":"Loan","issue":"Managing the loan or lease","sub-issue":"Problem with the interest rate","consumer_complaint_narrative":"","company_public_response":"","company":"CAPITAL ONE FINANCIAL CORPORATION","state":"NY","zip_code":12944,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Referral","date_sent_to_company":"01/22/2018","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"N/A","complaint_id":2789278,"product_id":"vehicle_loan_or_lease","subproduct_id":"loan"}
        ]


  Returns an array of complaint data filtered for a given state.

  * `?limit`:

  Limits the size of the returned data array.

  * Example:
    * Request: `api/v1/complaints?productId=credit_card&limit=2`
    * Response:
      * status: 200
      * body:
        [{"date_received":"09/14/2015","product":"Credit card","sub-product":"","issue":"Identity theft / Fraud / Embezzlement","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"","company":"CAPITAL ONE FINANCIAL CORPORATION","state":"MD","zip_code":20902,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Referral","date_sent_to_company":"09/16/2015","company_response_to_consumer":"Closed with explanation","timely_response?":"Yes","consumer_disputed?":"No","complaint_id":1563246,"product_id":"credit_card","subproduct_id":""},{"date_received":"09/14/2015","product":"Credit card","sub-product":"","issue":"Other","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"Company chooses not to provide a public response","company":"CITIBANK, N.A.","state":"CA","zip_code":92692,"tags":"Older American","consumer_consent_provided?":"Consent not provided","submitted_via":"Web","date_sent_to_company":"09/15/2015","company_response_to_consumer":"Closed with monetary relief","timely_response?":"Yes","consumer_disputed?":"No","complaint_id":1562964,"product_id":"credit_card","subproduct_id":""}]

  * `?count`:

  Returns the total number of documents that match the query.


####`GET /complaints/:id`

Returns complaint by passed Id.  The 'complaint_id' property of the data correspondes to the passed :id param.

* Example:
  * Request: `api/v1/complaints/2467650`
  * Response:
    * status: 200
    * body:
      [
        {"date_received":"04/26/2017","product":"Mortgage","sub-product":"Other type of mortgage","issue":"Trouble during payment process","sub-issue":"","consumer_complaint_narrative":"","company_public_response":"Company has responded to the consumer and the CFPB and chooses not to provide a public response","company":"BANK OF AMERICA, NATIONAL ASSOCIATION","state":"NY","zip_code":11542,"tags":"","consumer_consent_provided?":"N/A","submitted_via":"Referral","date_sent_to_company":"04/27/2017","company_response_to_consumer":"Closed with monetary relief","timely_response?":"Yes","consumer_disputed?":"N/A","complaint_id":2467650,"product_id":"mortgage","subproduct_id":"other_type_of_mortgage"}
      ]


####`GET /complaints/products`

Returns an array of product types and corresponding document count of complaints.  Results are sorted from greatest to least to return the product with the most complaints as the first element.

* Example:
  * Request: `api/v1/complaints/products`
  * Response:
    * status: 200
    * body:
      [
        {"key":"mortgage","doc_count":183271},
        {"key":"debt_collection","doc_count":140892},{"key":"credit_reporting_credit_repair_services_or_other_personal_consumer_reports","doc_count":113683},{"key":"credit_reportingincorrect_information_on_credit_report","doc_count":69305},
        {"key":"bank_account_or_service","doc_count":59719},{"key":"credit_card","doc_count":58555},
        {"key":"student_loan","doc_count":27576},
        {"key":"checking_or_savings_account","doc_count":24102},
        {"key":"credit_card_or_prepaid_card","doc_count":23895},{"key":"consumer_loan","doc_count":19075}
      ]

  *Query Params*:

  * `?company`:

  Returns the document counts of all complain documents for a given company.

    * Example:
      * Request: `api/v1/complaints/products?company=wells%20fargo`
      * Response:
        * status: 200
        * body:
          [
            {"key":"mortgage","doc_count":25031},{"key":"bank_account_or_service","doc_count":9550},{"key":"checking_or_savings_account","doc_count":2883},
            {"key":"credit_card","doc_count":2813},
            {"key":"consumer_loan","doc_count":1659},
            {"key":"debt_collection","doc_count":1346},
            {"key":"credit_card_or_prepaid_card","doc_count":1041},
            {"key":"student_loan","doc_count":971},{"key":"credit_reporting_credit_repair_services_or_other_personal_consumer_reports","doc_count":785},
            {"key":"vehicle_loan_or_lease","doc_count":339}
          ]

  * `?productId`:

  Returns the document counts of all complaint documents for a given product Id.

   * Example:
      * Request: `api/v1/complaints/products?productId=payday%20loans`
      * Response:
        * status: 200
          * body:
            [
              {"key":"mortgage","doc_count":183271},
              {"key":"debt_collection","doc_count":140892},{"key":"credit_reporting_credit_repair_services_or_other_personal_consumer_reports","doc_count":113683},
              {"key":"credit_reportingincorrect_information_on_credit_report","doc_count":69305},
              {"key":"bank_account_or_service","doc_count":59719},
              {"key":"credit_card","doc_count":58555},
              {"key":"student_loan","doc_count":27576},
              {"key":"checking_or_savings_account","doc_count":24102},{"key":"credit_card_or_prepaid_card","doc_count":23895},
              {"key":"consumer_loan","doc_count":19075}
            ]

  * `?limit`:

  Limit the results returned. `?limit=1` will return the product with the most complaints.

   * Example:
      * Request: `api/v1/complaints/products?limit=1`
      * Response:
        * status: 200
          * body:
            [
              {"key":"mortgage","doc_count":183271}
            ]

  * `?count`:

  Returns the count of all complaint documents

   * Example:
      * Request: `api/v1/complaints/products?count=true`
      * Response:
        * status: 200
          * body:
            768421

####`GET /complaints/states`

Returns an array of all states and corresponding document counts of complaints. Results are sorted from greatest to least to return the state with the most complaints as the first element.

  * Example:
    * Request: `api/v1/complaints/states?company=wells%20fargo`
    * Response:
      * status: 200
        * body:
          [
            {"key":"ca","doc_count":113671},
            {"key":"fl","doc_count":75156},
            {"key":"tx","doc_count":63327},
            ...
            {"key":"vt","doc_count":683},
            {"key":"nd","doc_count":593}
          ]

  *Query Params*:

  * `?company`:

  Returns the document counts of all complaint documents per state for a given company.

   * Example:
      * Request: `api/v1/complaints/states?company=wells%20fargo`
      * Response:
        * status: 200
          * body:
            [
              {"key":"ca","doc_count":9690},
              {"key":"fl","doc_count":4942},
              {"key":"tx","doc_count":2852},
              {"key":"ga","doc_count":2580},
              ...
              {"key":"nd","doc_count":39},
              {"key":"wv","doc_count":31},
              {"key":"ae","doc_count":21}
            ]


  * `?productId`:

  Returns the document counts of all complaint documents per state for a given product Id.

   * Example:
      * Request: `api/v1/complaints/states?productId=payday_loan`
      * Response:
        * status: 200
          * body:
          [
            {"key":"ca","doc_count":922},
            {"key":"tx","doc_count":756},
            {"key":"fl","doc_count":463},
            {"key":"oh","doc_count":445},
            ...
            {"key":"ak","doc_count":6},
            {"key":"nd","doc_count":6},
            {"key":"vt","doc_count":6}
          ]


  * `?limit`:

  Limit the results returned. `?limit=1` will return the state with the most complaints.
   * Example:
      * Request: `api/v1/complaints/states?limit=3`
      * Response:
        * status: 200
          * body:
            [
              {"key":"ca","doc_count":113671},
              {"key":"fl","doc_count":75156},
              {"key":"tx","doc_count":63327}
            ]

  * `?count`:

  Returns the count of all complaint documents

   * Example:
    * Request: `api/v1/complaints/states?count=true`
    * Response:
      * status: 200
        * body:
          768421

##

### Population

####`GET /population`

  * Example:
    * Request:
    * Response:
      * status: 200
        * body:

  *Query Params*:

  `?limit`

    * Example:
      * Request:
      * Response:
        * status: 200
          * body:

  `?count`

    * Example:
      * Request:
      * Response:
        * status: 200
          * body:

####`GET /population/growth`

Returns an array of all states with the population change, expressed as an integer, representing the aggregate population difference number for that state over the given time period (default time period if no fromYear or toYear query params supplied). Results are sorted from greatest aggregate change to smallest, so the state with the greatest aggregate change is first element.

  * Example:
    * Request: `/api/v1/population/growth`
    * Response:
      * status: 200
        * body:
          [
            {"key":"texas","doc_count":1,"populationChange":3062948},
            {"key":"california","doc_count":1,"populationChange":2208963},
            {"key":"florida","doc_count":1,"populationChange":2137939},
            {"key":"georgia","doc_count":1,"populationChange":716683},
            {"key":"north_carolina","doc_count":1,"populationChange":699172},
            ...
            {"key":"vermont","doc_count":1,"populationChange":-2185},
            {"key":"west_virginia","doc_count":1,"populationChange":-38458},
            {"key":"illinois","doc_count":1,"populationChange":-39173}]

  *Query Params*:

  `?rate`

  Returns an array of all states with the population change, expressed as a floating point number,representing the percentage of change for that state over the given time period (default time period if no fromYear or toYear query params supplied). Results are sorted from greatest rate of change to smallest, so the state with the greatest rate of change is first element.

    * Example:
      * Request: `api/v1/population/growth?rate=true`
      * Response:
        * status: 200
          * body:
            [
              {"key":"texas","doc_count":1,"populationChange":12.1345005},
              {"key":"north_dakota","doc_count":1,"populationChange":11.990044},
              {"key":"utah","doc_count":1,"populationChange":11.767294},
              {"key":"florida","doc_count":1,"populationChange":11.343982},
              {"key":"colorado","doc_count":1,"populationChange":11.076105},
              ...
              {"key":"vermont","doc_count":1,"populationChange":-0.34912965},
              {"key":"illinois","doc_count":1,"populationChange":-0.30505726},
              {"key":"connecticut","doc_count":1,"populationChange":0.22381611}
            ]

  `?fromYear`

  Sets the starting year for the query.  If omitted will default to first available year.

    * Example:
      * Request: `api/v1/population/growth?rate=true&fromYear=2014`
      * Response:
        * status: 200
          * body:
            [
              {"key":"texas","doc_count":1,"populationChange":1350160},
              {"key":"florida","doc_count":1,"populationChange":1086653},
              {"key":"california","doc_count":1,"populationChange":835375},
              {"key":"washington","doc_count":1,"populationChange":358812},
              {"key":"georgia","doc_count":1,"populationChange":345529},
                ...
              {"key":"connecticut","doc_count":1,"populationChange":-12004},
              {"key":"west_virginia","doc_count":1,"populationChange":-31767},
              {"key":"illinois","doc_count":1,"populationChange":-80415}]

  `?toYear`

  Sets the ending year for the query. If omitted will default to last available year.

    * Example:
      * Request: `api/v1/population/growth?toYear=2016`
      * Response:
        * status: 200
          * body:
            [
              {"key":"texas","doc_count":1,"populationChange":2663214},
              {"key":"california","doc_count":1,"populationChange":1968786},
              {"key":"florida","doc_count":1,"populationChange":1810128},
              {"key":"georgia","doc_count":1,"populationChange":600924},
              {"key":"north_carolina","doc_count":1,"populationChange":582442},
              ...
              {"key":"vermont","doc_count":1,"populationChange":-2488},
              {"key":"illinois","doc_count":1,"populationChange":-5470},
              {"key":"west_virginia","doc_count":1,"populationChange":-25678}]

  `?limit`

    * Example:
      * Request: `api/v1/population/growth?limit=3`
      * Response:
        * status: 200
          * body:
            [
              {"key":"texas","doc_count":1,"populationChange":3062948},
              {"key":"california","doc_count":1,"populationChange":2208963},
              {"key":"florida","doc_count":1,"populationChange":2137939}
              ]

##

### Status

####`GET /status`

  * Example:
    * Request: `api/v1/status`
    * Response:
      * status: 200
      * body:
          {"status":"all good!","version":"0.0.1","name":"cctest","description":"Ombud API Test"}

####`GET /status/db`

  * Example:
    * Request: `api/v1/status`
    * Response:
      * status: 200
      * body:
          {"status":"all good!","version":"0.0.1","name":"cctest","description":"Ombud API Test"}