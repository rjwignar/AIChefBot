// components for displaying user data
// may only be used for demonstration

import { Card, Container } from "react-bootstrap";

const UserData = (props) => {
    // user must be fetched and supplied to this component 
    const { user } = props;

    return user == null ? 
    (
    // if user is null, return nothing
    <>No user found!</>
    ) : (
        // if user is not null, show details
        <Card body className="fs-4">
          <h3>User:</h3>
          name: <span style={{ color: "green" }}>{user.username}</span>
          <br />
          email: <span style={{ color: "green" }}>{user.email}</span><br/>
          <br />
          <h3>appliances:</h3>
          <ul classame="fs-4">
            {user.appliances.length ? (
              user.appliances.map((item, i) => (
                <li key={i}>
                  <span style={{ color: "green" }}>{item}</span>
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          <h3>requests:</h3>
          <div classame="fs-4">
            {user.requests.length ? (
              user.requests.map((request, i) => (
                <>
                  <span key={i} style={{ color: "green" }}>{request.query}</span>
                  <br/>
                  <Container className="col-md-11">
                  <br/>
                  <h4>ingredients </h4>
                  <ul>
                  {request.ingredients.map((ingredient, i) => (
                    <li><span style={{ color: "blue" }}>{ingredient}</span></li>
                  ))}
                  </ul>
                  <br/>
                  
                  <h4>generated recipes:</h4>
                  <hr/>
                  {request.recipes.map((recipe, i) => (
                    <>
                      <h4 key={i}>{String.fromCharCode(97 + i)}: {recipe.name}</h4>
                      <span style={{ color: "blue" }}>{recipe.details}</span>
                      <br/><br/>
                    </>
                  ))}
                  </Container>
                </>
              ))
            ) : (
              <>None</>
            )}
          </div>
        </Card>
      )
}

export default UserData;