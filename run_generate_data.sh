#!/bin/bash

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Running data generator..."
echo "Connecting to: postgresql://challenge:challenge_2024@localhost:5433/challenge_db"
echo ""

python generate_data.py --db-url postgresql://challenge:challenge_2024@localhost:5433/challenge_db

