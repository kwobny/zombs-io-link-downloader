import os

def getFiles():
  import requests

  with open("urls.txt", "r") as file:
      linkList = file.read().splitlines()

  for link in linkList:
    if not os.path.exists(link):
      os.makedirs("/".join(link.split("/")[0:-1]), exist_ok = True)
      r = requests.get("http://zombs.io/" + link)
      with open(link, "xb") as outputFile:
        outputFile.write(r.content)

def combineDirectories(source, destination):
  """
  A function which places files from source into destination if the file is not already present in destination.

  A function which prints out the files that are present in source but not in destination.
  """

  import shutil

  for root, dirs, files in os.walk(source):
    root += "/"

    spl = root.split("/")
    spl[0] = destination
    destRoot = "/".join(spl)
    for f in files:
      if not os.path.exists(destRoot + f):
        print(root + f)
        #os.makedirs(destRoot, exist_ok = True)
        #shutil.copy2(root + f, destRoot)

combineDirectories("asset", "asset_from_urls")