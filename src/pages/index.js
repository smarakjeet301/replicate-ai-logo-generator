import { useState, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import JSZip from 'jszip'
import download from 'js-file-download';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)

  const generateLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ai-logo-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const { logos } = await response.json();
      setOpen(true)
      setLogos(logos[0]);
    } catch (error) {
      console.error("Failed to generate logos:", error);
    } finally {
      setLoading(false);
    }
  };


  async function createZip(logos) {
    const zip = new JSZip();
    for (let i = 0; i < logos.length; i++) {
      try {
        const response = await fetch(logos[i]);
        const arrayBuffer = await response.arrayBuffer();
        zip.file(`image_${i}.jpg`, arrayBuffer);
      } catch (error) {
        console.error(`Error adding image ${i} to zip:`, error);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      download(blob, 'prompt_output_images.zip'); // Change the zip file name as per your requirement
    });
  }

  function downloadFiles() {
    createZip(logos)
  }

  return (
    <div className="container max-w-300 flex flex-col justify-center mx-auto relative px-2.5 h-screen">
      <div className='w-full h-full flex flex-col items-center'>
        <div className='grow grid grid-cols-1 md:grid-cols-2 gap-8 py-12'>
          <div className='max-w-screen-lg text-center md:text-left mx-auto my-auto'>
            <div>
              <h1 className="font-bold text-white text-4xl md:text-5xl mb-10">AI Logo Generator</h1>
              <h2 className='text-xl md:text-2xl mt-4 mb-6 text-white'>Use advanced AI to generate a beautiful logo. Free to get started. </h2>
            </div>

            <div className='flex-auto flex-col'>
              <div className='flex-auto pb-2'>
                <textarea
                  type="text"
                  placeholder="Enter your logo prompt text... Example: Design a logo for a luxury skincare brand using organic ingredients and eco-friendly packaging."
                  className="rounded placeholder-grayscale-600 placeholder-opacity-50 mb-0 transition-colors duration-300 border border-grayscale-500 w-full p-4 px-3 shadow-inner focus:border-secondary-500 focus:outline-none focus:shadow-sm md:text-lg h-36 max-h-64"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className='pb-2'>
                <div className='w-full md:w-auto h-12'>
                  <button
                    onClick={generateLogos}
                    className="font-sans cursor-pointer border-2 font-bold text-white uppercase border-solid transition-colors duration-300 text-base py-4 px-8 w-full rounded bg-primary-500 border-primary-500 hover:border-primary-700 hover:bg-primary-600"
                    disabled={loading}
                  >
                    {
                      loading ? "Generating..." : "Generate Logos"
                    }
                  </button>
                  <div className="font-sans text-white text-center p-2 font-bold">Powered by: <a href="https://replicate.com" target="_blank" className="cursor-pointer">Replicate</a></div>
                  <div className="font-sans text-white text-center p-2 font-bold">Developed by: <a href="https://github.com/smarakjeet301" target="_blank" className="cursor-pointer">Smarak Jeet Nayak</a></div>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Prompt Output
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {logos.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {logos.map((logo, index) => (
                              <img
                                key={index}
                                src={logo}
                                alt={`Logo ${index + 1}`}
                                className="w-48 h-auto mx-2 my-4"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={downloadFiles} className="font-sans cursor-pointer border-2 font-bold text-white uppercase border-solid transition-colors duration-300 text-base p-4 rounded bg-black">Download ZIP</button>

                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


    </div>
  );
}
