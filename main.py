import os

def getFiles():
  import requests

  with open("urls.txt", "r") as file:
      linkList = file.read().splitlines()

  for link in linkList:
    link = "public" + link
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

def updateIndexHTML():
  import requests

  site = requests.get("http://zombs.io")
  html = site.content

  lowIndex = 0
  highIndex = 0

  with open("public/index.html", "wb") as out:
    #first replacement
    highIndex = html.index(b'href="/asset/app.css', lowIndex)
    highIndex = html.index(b'"', highIndex) + 1

    out.write(html[lowIndex:highIndex])
    out.write(b"asset/app1ff2.css")

    lowIndex = html.index(b'"', highIndex)

    #second replacement
    highIndex = html.index(b'<script src="/asset/app.js', lowIndex)
    highIndex = html.index(b'"', highIndex) + 1

    out.write(html[lowIndex:highIndex])
    out.write(b"asset/app2d60.js")

    lowIndex = html.index(b'"', highIndex)

    #third replacement (not really replacement, but add)
    highIndex = html.index(b'Sentry.init({', lowIndex)
    highIndex = html.index(b"'https://zombs.io'", highIndex) + 1
    highIndex = html.index(b"'", highIndex) + 1

    out.write(html[lowIndex:highIndex])
    out.write(b", 'https://zombsclone.netlify.app'")

    lowIndex = highIndex

    #save rest of string
    out.write(html[lowIndex:])

getFiles()