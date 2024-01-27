// components for displaying user data
// may only be used for demonstration

import { Card, Container } from "react-bootstrap";

const UserData = (props) => {

  // user must be fetched and supplied to this component
  const { user } = props;

  if (user == null) 
    return (
    // if user is null, return nothing
    <></>
  ) 
  else if (user == "None") return (
    // user was not found
    <Card body className="fs-4 p-2 bg-light bg-opacity-50">
      <span>No User Found!</span>
    </Card>
  )
  else return (
    // if user is not null, show details
    <Card body className="fs-4 p-2 bg-light bg-opacity-50">
      <h3>User:</h3>
      name: <span style={{ color: "green" }}>{user.username}</span>
      <br />
      email: <span style={{ color: "green" }}>{user.email}</span>
      <br />
      <br />
      <h3>appliances:</h3>
      {user.appliances.length ? (
        <ul classame="fs-4">
          {user.appliances.map((item, i) => (
            <li key={i}>
              <span style={{ color: "green" }}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <span style={{ color: "green" }}>{user.username}</span> has not added
          any appliances.
          <br />
        </>
      )}
      <br />
      <h3>requests:</h3>
      <div classame="fs-4">
        {user.requests.length ? (
          user.requests.map((request, i) => (
            <>
              <span key={i} style={{ color: "green" }}>
                {request.query}
              </span>
              <br />
              <Container className="col-md-11">
                <br />
                <h4>ingredients </h4>
                <ul>
                  {request.ingredients.map((ingredient, i) => (
                    <li>
                      <span key={i} style={{ color: "blue" }}>{ingredient}</span>
                    </li>
                  ))}
                </ul>
                <br />

                <h4>generated recipes:</h4>
                <hr />
                {request.recipes.map((recipe, i) => (
                  <>
                    <p key={i} style={{ color: "blue" }}>
                      &raquo; {recipe.name}
                    </p>
                    <span style={{ color: "rgb(50,50,50)" }}>{recipe.details}</span>
                    <br />
                    <br />
                  </>
                ))}
              </Container>
            </>
          ))
        ) : (
          <>
            no recipes have been requested.
            <br />
          </>
        )}
      </div>
      
    </Card>
  );
};

export default UserData;
