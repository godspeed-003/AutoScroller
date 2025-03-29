"""
This is the Python file which inspired the extensions.
Author: Vedant Korade
"""

import time
import pyautogui


class Scroller:

    def press_down_arrow(self):
        try:
            delay = int(input("Enter the time you want to watch one video (in seconds): "))
            count = int(input("Enter how many videos you want to see: "))
            start_in = int(input("Enter time you want for starting the app (in Seconds): "))
            time.sleep(start_in)

            for press in range(count):  #press goes from 0 to count - 1
                pyautogui.press('down') #simulates pressing the down arrow key
                print("SCROLL!", (press+1))
                time.sleep(delay)
            print("Done!")

        except ValueError:
            print("Invalid input. Please enter numbers for both time and count.")

# Instantiate the Scroller class outside the class definition
scroller = Scroller()
scroller.press_down_arrow()
