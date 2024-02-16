import React from 'react';
import Link from 'next/link';

// Simple custom error page
const Error = ({ statusCode }) => {
   return (
      <div style={{ padding: '100px 30px', textAlign: 'center' }}>
         <h1>{statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}</h1>
         <p>
            Sorry, something went wrong. Please try again later or return to the{' '}
            <Link href="/">
               homepage
            </Link>.
         </p>
      </div>
   );
}

Error.getInitialProps = ({ res, err }) => {
   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
   return { statusCode };
};

export default Error;