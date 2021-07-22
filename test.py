from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """This runs before each test"""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_index(self):
        """check for HTML and information populated properly"""

        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIn(session.get('highscore'))

    def test_invalid_word(self):
        """Test dictionary for word"""

        self.client.get('/')
        response = self.client.get('/check-for-word?word=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')