import requests
from bs4 import BeautifulSoup
import sys

def get_leetcode_stats(username):
    # Construct the URL with the username
    url = f"https://leetcode.com/{username}/"
    
    # Send an HTTP GET request to the website
    response = requests.get(url)
    
    # Parse the HTML code using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Scraping data
    noSolved = soup.find(class_='text-[24px] font-medium text-label-1 dark:text-dark-label-1')

    solved = soup.findAll(class_='mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1')
    for s in solved:
        print(s.text)

    total_pro = soup.findAll(class_='text-xs font-medium text-label-4 dark:text-dark-label-4')
    for s in total_pro:
        print(s.text[1:])

    beats = soup.findAll(class_='font-medium text-label-2 dark:text-dark-label-2')
    for s in beats:
        print(s.text)

    # Extracting user image
    user_image = soup.find('img', {'class': 'user-avatar'})
    if user_image:
        user_image_url = user_image['src']
        print("Image URL:", user_image_url)
    else:
        print("Image URL not found or invalid.")

    # Extracting social profiles
    social_profiles = soup.findAll(class_='flex items-start space-x-[9px]')
    for profile in social_profiles:
        profile_svg = profile.find(class_='mt-0.5 text-base')
        profile_name = profile.find(class_='overflow-hidden').find(class_='truncate').text.strip()
        print(profile_svg, profile_name)

if __name__ == "__main__":
    username = "gantavenkatakousik2021"
    get_leetcode_stats(username)
