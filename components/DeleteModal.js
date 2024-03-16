// DeleteModal.js
import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import {
  CognitoIdentityProviderClient,
  DeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useSession, signOut } from "next-auth/react";

function DeleteModal({ show, onHide, username }) {
  const [inputUsername, setInputUsername] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  // Handle input change
  const handleUsernameChange = (e) => {
    setInputUsername(e.target.value);
    setError(""); // Clear error when user starts typing
  };

  const enhancedOnHide = () => {
    setInputUsername("");
    onHide();
  };

  const getRecipes = async () => {
    try {
      const res = await fetch(`/api/recipes/request?id=${session.user.id}`, {
        method: "GET",
      });
      const recipes = await res.json();
      return recipes;
    } catch (err) {
      console.error(err);
    }
  };

  const removeImages = async (image_ids) => {
    console.log(`Removing images with these id values: ${image_ids}`);

    // Delete images from Cloudinary environment
    const res = await fetch(`/api/images/request`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_ids: image_ids }),
    });

  }
  const deleteRecipeImages = async () => {
    let recipeList = await getRecipes();
    console.log("Recipe list for user", recipeList);

    // extract list of AI-generated imageURLs from recipeList
    const imageIds = recipeList.reduce((list, recipe) => {
      if (recipe.hasOwnProperty('image_id')) {
        list.push(recipe.image_id);
      }
      return list;
    }, []);

    console.log(imageIds);
    // If there are any images hosted on Cloudinary, remove them
    if (imageIds.length >= 1) {
      console.log(`Removing ${imageIds.length} recipes`);
      await removeImages(imageIds);
    }
  }

  // Validate username and perform deletion
  const handleDeleteAccount = async () => {
    if (inputUsername !== username) {
      setError("Username does not match.");
      return;
    }
    console.log("Deleting account with " + username);

    // Delete any saved recipe images from Cloudinary
    await deleteRecipeImages();

    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

    // DeleteUserRequest
    const input = {
      AccessToken: session.user.accessToken, // required
    };
    try {
      const command = new DeleteUserCommand(input);
      await client.send(command);
      signOut({ callbackUrl: "/logout" });
    } catch (error) {
      console.error("Could not delete AWS Cognito Account:", error);
    }

    try {
      // Delete user MongoDB
      const res = await fetch(`/api/user/request`, {
        method: "DELETE",
        headers: {
          "Content-Type": "text/plain",
        },
        body: session.user.id,
      });
      if (res) {
        console.log("Successfully deleted recipe/diet data.");
      } else {
        throw new Error("Could not delete user recipe/diet data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={enhancedOnHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">
          Warning: Deleting your account is irreversible. You will not be able
          to recover any data associated with your account after deletion.
        </Alert>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="usernameInput">
            <Form.Label>Confirm Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username to confirm"
              value={inputUsername}
              onChange={handleUsernameChange}
            />
            <Form.Text className="text-muted">
              Enter your username to enable the delete button.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={enhancedOnHide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          disabled={!inputUsername}
        >
          Delete Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
