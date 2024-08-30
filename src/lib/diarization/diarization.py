from pyannote.audio import Pipeline
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="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")
import json
import sys
import torch
import os
import argparse
import psutil
import random
# Get the total number of available CPU cores
total_cores = psutil.cpu_count()

random_cores = random.sample(range(total_cores), 4)
print(random_cores)
# Set the CPU affinity to use only cores
psutil.Process(os.getpid()).cpu_affinity(random_cores)


# Create an ArgumentParser object
parser = argparse.ArgumentParser(description='Example script to read from one JSON file and write to another.')

# Define command-line arguments for source and destination file paths
parser.add_argument('source_file', type=str, help='The path of the source JSON file to read.')
parser.add_argument('destination_file', type=str, help='The path of the destination JSON file to write.')

# Parse the command-line arguments
args = parser.parse_args()
# Access the parsed arguments
source_file_path = args.source_file
destination_file_path = args.destination_file
splittedPath  = destination_file_path.split("/")
directoryPath = "/".join(splittedPath[:-1])

# pipeline.to(torch.device("cuda"))

# apply pretrained pipeline
diarization = pipeline(source_file_path)


class SpeakerModel:
    def __init__(self, start, end,speaker):
        self.start = start
        self.end = end
        self.speaker = speaker

result = []

for turn, _, speaker in diarization.itertracks(yield_label=True):
    result.append(SpeakerModel(turn.start *1000, turn.end *1000, speaker).__dict__)



if(len(directoryPath) > 0):
    # Get the directory from the file path
    directory = os.path.dirname(directoryPath)

    # Check if the directory exists, and create it if not
    if not os.path.exists(directoryPath):
        os.makedirs(directoryPath)

with open(destination_file_path, 'w') as f:
    json.dump(result, f, indent = 2)
