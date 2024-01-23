// components for displaying user data
// may only be used for demonstration

import { Card, Container } from "react-bootstrap";

const UserData = (props) => { 
    const { user } = props;
    console.log(user);
    return user == null ? (
        <></>
      ) : (
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
                  {i+ 1}: <span style={{ color: "green" }}>{request.query}</span>
                  <br/>
                  {/*<br/>ingredients:&nbsp;<span style={{ color: "green" }}>{request.ingredients}</span>*/}
                  
                  <br/>
                  <Container>
                  <h4>generated recipes:</h4>
                  <hr/>
                  {request.recipes.map((recipe, i) => (
                    <p key={i}>
                      <h4>{String.fromCharCode(97 + i)}: {recipe.name}</h4>
                      <span style={{ color: "green" }}>{recipe.details}</span>
                    </p>
                    
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